import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { jobTitle, company, jobDescription } = body

    if (!jobTitle || !company || !jobDescription) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create a comprehensive prompt for the AI
    const prompt = `
You are an expert hiring manager and assessment designer. Analyze the following job information and create a comprehensive technical assessment:

Job Title: ${jobTitle}
Company: ${company}
Job Description: ${jobDescription}

IMPORTANT: Extract and infer the following details from the job description:
- Required technical skills and technologies
- Experience level (entry, mid, senior, lead)
- Team size and structure
- Company culture and values
- Specific domain expertise needed
- Soft skills and behavioral requirements

Based on your analysis, create a customized assessment with the following structure:
1. 4-6 questions that test technical skills relevant to the specific role and technologies mentioned
2. 2-3 questions that test problem-solving abilities in the company's domain
3. 1-2 questions that assess cultural fit and soft skills based on company values
4. Include detailed expected answers or evaluation criteria for each question
5. Assign difficulty levels (Easy, Medium, Hard) appropriate for the experience level
6. Provide specific categories that match the job requirements

Make the questions:
- Highly specific to the role and company context
- Challenging but fair for the experience level
- Focused on real-world scenarios they'll face
- Avoid generic programming questions

Return the response in the following JSON format:
{
  "questions": [
    {
      "type": "technical|problem-solving|behavioral",
      "question": "The actual question text",
      "expectedAnswer": "What to look for in a good answer",
      "difficulty": "Easy|Medium|Hard",
      "category": "Specific category like 'React Development', 'System Design', 'Leadership', etc."
    }
  ],
  "criteria": {
    "technical": 40,
    "problemSolving": 30,
    "communication": 20,
    "cultural": 10
  },
  "timeLimit": 90,
  "instructions": "Clear instructions for the assessment",
  "extractedInfo": {
    "experienceLevel": "extracted experience level",
    "keySkills": ["skill1", "skill2", "skill3"],
    "teamSize": "estimated team size",
    "companyType": "startup|enterprise|agency|etc"
  }
}
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert hiring manager and assessment designer. Always respond with valid JSON only, no additional text or explanations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const aiResponse = completion.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Parse the AI response
    let assessmentData
    try {
      // Clean the AI response - remove markdown code blocks if present
      let cleanResponse = aiResponse.trim()
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      assessmentData = JSON.parse(cleanResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      console.error('Raw AI response:', aiResponse)
      // If parsing fails, return a fallback assessment
      assessmentData = createFallbackAssessment(jobTitle, company)
    }

    // Add the job details to the response
    const finalAssessment = {
      jobTitle,
      company,
      ...assessmentData
    }

    return NextResponse.json(finalAssessment)

  } catch (error) {
    console.error('Error generating assessment:', error)
    
    // Return a fallback assessment in case of error
    const body = await request.json().catch(() => ({}))
    const fallbackAssessment = createFallbackAssessment(
      body.jobTitle || 'Software Developer',
      body.company || 'Tech Company'
    )
    
    return NextResponse.json(fallbackAssessment)
  }
}

function createFallbackAssessment(jobTitle: string, company: string) {
  return {
    jobTitle,
    company,
    questions: [
      {
        type: 'technical',
        question: 'Explain the differences between synchronous and asynchronous programming. Provide examples of when you would use each approach.',
        expectedAnswer: 'Look for understanding of blocking vs non-blocking operations, callbacks, promises, async/await, and practical examples.',
        difficulty: 'Medium',
        category: 'Programming Fundamentals'
      },
      {
        type: 'problem-solving',
        question: 'Design a simple caching system that can store and retrieve data efficiently. What data structures would you use and why?',
        expectedAnswer: 'Should mention hash maps, LRU cache, time-based expiration, and trade-offs between memory and speed.',
        difficulty: 'Medium',
        category: 'System Design'
      },
      {
        type: 'technical',
        question: 'How would you optimize a slow database query? Walk through your debugging process.',
        expectedAnswer: 'Should cover query analysis, indexing, query optimization, database profiling tools, and monitoring.',
        difficulty: 'Medium',
        category: 'Database Optimization'
      },
      {
        type: 'behavioral',
        question: 'Describe a time when you had to learn a new technology quickly for a project. How did you approach it?',
        expectedAnswer: 'Look for learning strategies, time management, resourcefulness, and ability to apply new knowledge.',
        difficulty: 'Medium',
        category: 'Adaptability'
      },
      {
        type: 'problem-solving',
        question: 'If you were tasked with improving the performance of a web application, what steps would you take?',
        expectedAnswer: 'Should cover performance monitoring, identifying bottlenecks, optimization strategies, and measurement techniques.',
        difficulty: 'Medium',
        category: 'Performance Optimization'
      }
    ],
    criteria: {
      technical: 40,
      problemSolving: 30,
      communication: 20,
      cultural: 10
    },
    timeLimit: 90,
    instructions: 'This assessment evaluates your technical knowledge, problem-solving abilities, and cultural fit for our team. Please provide detailed answers and explain your reasoning.'
  }
}
