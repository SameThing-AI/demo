import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { assessmentData, answers, candidateProfile, timeSpent } = body

    if (!assessmentData || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key not configured, using fallback evaluation')
      const fallbackResults = createFallbackEvaluation(assessmentData, answers, timeSpent, candidateProfile)
      return NextResponse.json(fallbackResults)
    }

    // Get job description from assessment or use default
    const jobDescription = assessmentData.description || `${assessmentData.title} role at ${assessmentData.company}`
    const assessmentType = assessmentData.type || 'traditional'
    
    // Build candidate context
    const candidateContext = candidateProfile ? `
Candidate Background:
- Name: ${candidateProfile.name || 'Anonymous'}
- Experience: ${candidateProfile.experience || 'Not specified'}
- Skills: ${candidateProfile.skills?.join(', ') || 'Not specified'}
- Education: ${candidateProfile.education || 'Not specified'}
- Summary: ${candidateProfile.summary || 'Not provided'}
- LinkedIn Profile: ${candidateProfile.linkedinUrl ? 'Available' : 'Not provided'}
` : 'No candidate profile provided.'

    // Create comprehensive evaluation prompt
    const evaluationPrompt = `
You are a senior technical interviewer and assessment specialist. You are evaluating a candidate's responses for the following position:

JOB DETAILS:
Position: ${assessmentData.title}
Company: ${assessmentData.company}
Job Description: ${jobDescription}
Assessment Type: ${assessmentType}

${candidateContext}

ASSESSMENT PERFORMANCE:
Total Questions: ${assessmentData.questions?.length || 0}
Time Allocated: ${assessmentData.duration || 60} minutes
Time Used: ${Math.floor((timeSpent || 0) / 60)} minutes

QUESTIONS AND RESPONSES:
${assessmentData.questions?.map((q: any, i: number) => `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUESTION ${i + 1}: [${q.type?.toUpperCase() || 'TEXT'}] [${q.points || 10} points]
${q.question}

Expected Answer Guidelines:
${q.expectedAnswer || 'Evaluate based on technical accuracy, clarity, and depth of understanding.'}

Candidate's Response:
${answers[i] || '❌ NO ANSWER PROVIDED'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`).join('')}

EVALUATION CRITERIA:
1. Technical Accuracy (40%): Correctness of technical concepts and solutions
2. Problem-Solving Approach (25%): Logical thinking and methodology
3. Communication & Clarity (20%): How well ideas are expressed
4. Depth of Knowledge (15%): Understanding of underlying principles

Please provide a comprehensive, fair, and constructive evaluation. Consider the job requirements, candidate's background, and industry standards.

Respond with valid JSON only (no additional text):
{
  "totalScore": 85,
  "maxScore": 100,
  "percentage": 85,
  "passed": true,
  "grade": "B+",
  "timeEfficiency": 90,
  "breakdown": {
    "technical": {
      "score": 32,
      "max": 40,
      "percentage": 80,
      "feedback": "Strong technical understanding with minor gaps"
    },
    "problemSolving": {
      "score": 20,
      "max": 25,
      "percentage": 80,
      "feedback": "Good problem-solving approach"
    },
    "communication": {
      "score": 18,
      "max": 20,
      "percentage": 90,
      "feedback": "Clear and well-structured responses"
    },
    "depth": {
      "score": 12,
      "max": 15,
      "percentage": 80,
      "feedback": "Good understanding of fundamentals"
    }
  },
  "questionScores": [
    {
      "questionIndex": 0,
      "score": 8,
      "maxScore": 10,
      "percentage": 80,
      "feedback": "Good understanding demonstrated",
      "strengths": ["Clear explanation", "Correct concepts"],
      "improvements": ["Could provide more examples", "Deeper analysis needed"]
    }
  ],
  "overallFeedback": {
    "strengths": ["Strong technical foundation", "Clear communication", "Good problem-solving approach"],
    "improvements": ["Provide more detailed examples", "Consider edge cases", "Expand on theoretical knowledge"],
    "recommendations": ["Review advanced concepts", "Practice more complex scenarios"],
    "fitForRole": "Good fit with some areas for development",
    "summary": "Candidate shows solid technical skills and good communication. With some additional experience in advanced topics, would be a strong contributor to the team."
  },
  "nextSteps": {
    "recommended": true,
    "interviewFocus": ["Advanced technical concepts", "Real-world problem solving"],
    "additionalAssessments": ["Technical coding challenge", "System design discussion"]
  }
}`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer and assessment evaluator. Always respond with valid JSON only, no additional text."
        },
        {
          role: "user",
          content: evaluationPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    })

    const aiResponse = completion.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Parse the AI response
    let evaluationResults
    try {
      evaluationResults = JSON.parse(aiResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      // If parsing fails, create a fallback evaluation
      evaluationResults = createFallbackEvaluation(assessmentData, answers, timeSpent, candidateProfile)
    }

    // Add additional metadata
    const finalResults = {
      ...evaluationResults,
      timeSpent,
      assessmentTitle: assessmentData.title,
      company: assessmentData.company,
      completedAt: new Date().toISOString(),
      evaluatedBy: 'AI Assistant (GPT-4)',
      evaluationVersion: '2.0'
    }

    return NextResponse.json(finalResults)

  } catch (error: any) {
    console.error('Error evaluating assessment:', error)
    
    // Parse request body to get the data for fallback
    try {
      const body = await request.json()
      const fallbackResults = createFallbackEvaluation(
        body.assessmentData || {},
        body.answers || {},
        body.timeSpent || 0,
        body.candidateProfile
      )
      return NextResponse.json(fallbackResults)
    } catch (parseError) {
      // If we can't parse the request, return a minimal fallback
      return NextResponse.json({
        totalScore: 0,
        maxScore: 100,
        percentage: 0,
        passed: false,
        grade: 'F',
        timeEfficiency: 0,
        breakdown: {
          technical: { score: 0, max: 40, percentage: 0, feedback: "Assessment evaluation failed" },
          problemSolving: { score: 0, max: 25, percentage: 0, feedback: "Assessment evaluation failed" },
          communication: { score: 0, max: 20, percentage: 0, feedback: "Assessment evaluation failed" },
          depth: { score: 0, max: 15, percentage: 0, feedback: "Assessment evaluation failed" }
        },
        questionScores: [],
        overallFeedback: {
          strengths: [],
          improvements: ["Assessment could not be evaluated due to technical error"],
          recommendations: ["Please contact support"],
          fitForRole: "Unable to evaluate",
          summary: "Assessment evaluation failed due to technical error."
        },
        nextSteps: {
          recommended: false,
          interviewFocus: ["Manual review required"],
          additionalAssessments: ["Retry assessment"]
        },
        timeSpent: 0,
        assessmentTitle: 'Unknown',
        company: 'Unknown',
        completedAt: new Date().toISOString(),
        evaluatedBy: 'Error Handler',
        evaluationVersion: '2.0-error'
      })
    }
  }
}

function createFallbackEvaluation(assessmentData: any, answers: any, timeSpent: number, candidateProfile?: any) {
  const questionsAnswered = Object.keys(answers).length
  const totalQuestions = assessmentData.questions?.length || 0
  const completionRate = totalQuestions > 0 ? (questionsAnswered / totalQuestions) * 100 : 0
  
  // Basic scoring based on completion
  const baseScore = Math.min(completionRate, 100)
  const timeBonus = timeSpent < (assessmentData.duration * 60 * 0.8) ? 5 : 0
  const totalScore = Math.min(baseScore + timeBonus, 100)

  return {
    totalScore: Math.round(totalScore),
    maxScore: 100,
    percentage: Math.round(totalScore),
    passed: totalScore >= 70,
    grade: getGrade(totalScore),
    timeEfficiency: Math.round((1 - (timeSpent / (assessmentData.duration * 60))) * 100),
    breakdown: {
      technical: {
        score: Math.round(totalScore * 0.4),
        max: 40,
        percentage: Math.round(totalScore),
        feedback: "Automated evaluation - detailed review recommended"
      },
      problemSolving: {
        score: Math.round(totalScore * 0.25),
        max: 25,
        percentage: Math.round(totalScore),
        feedback: "Completion-based assessment"
      },
      communication: {
        score: Math.round(totalScore * 0.20),
        max: 20,
        percentage: Math.round(totalScore),
        feedback: "Manual review recommended for communication assessment"
      },
      depth: {
        score: Math.round(totalScore * 0.15),
        max: 15,
        percentage: Math.round(totalScore),
        feedback: "Basic completion assessment"
      }
    },
    questionScores: assessmentData.questions?.map((q: any, i: number) => ({
      questionIndex: i,
      score: answers[i] ? (q.points || 10) * 0.8 : 0,
      maxScore: q.points || 10,
      percentage: answers[i] ? 80 : 0,
      feedback: answers[i] ? "Answer provided - manual review needed" : "No answer provided",
      strengths: answers[i] ? ["Response submitted"] : [],
      improvements: answers[i] ? ["Detailed evaluation needed"] : ["Answer required"]
    })) || [],
    overallFeedback: {
      strengths: [`Completed ${questionsAnswered} out of ${totalQuestions} questions`],
      improvements: ["Detailed AI evaluation temporarily unavailable"],
      recommendations: ["Manual review recommended for comprehensive feedback"],
      fitForRole: "Requires detailed evaluation",
      summary: `Assessment completed with ${completionRate.toFixed(1)}% question completion rate. Detailed evaluation pending.`
    },
    nextSteps: {
      recommended: totalScore >= 70,
      interviewFocus: ["Technical discussion based on responses"],
      additionalAssessments: ["Manual review of responses"]
    },
    timeSpent,
    assessmentTitle: assessmentData.title,
    company: assessmentData.company,
    completedAt: new Date().toISOString(),
    evaluatedBy: 'Fallback System',
    evaluationVersion: '2.0-fallback'
  }
}

function getGrade(score: number): string {
  if (score >= 97) return 'A+'
  if (score >= 93) return 'A'
  if (score >= 90) return 'A-'
  if (score >= 87) return 'B+'
  if (score >= 83) return 'B'
  if (score >= 80) return 'B-'
  if (score >= 77) return 'C+'
  if (score >= 73) return 'C'
  if (score >= 70) return 'C-'
  if (score >= 67) return 'D+'
  if (score >= 60) return 'D'
  return 'F'
}