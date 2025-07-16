import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Types for revolutionary assessment scenarios
interface Scenario {
  type: string
  title: string
  scenario: string
  initialChallenge: string
  plotTwists: string[]
  tools: string[]
  constraints: string[]
  successCriteria: string
  difficulty: string
  estimatedTime: number
  category: string
}

interface AssessmentData {
  assessmentType?: string
  title?: string
  description?: string
  scenarios?: Scenario[]
  instructions?: string
  totalTime?: number
  aiAssistanceMode?: string
  uniqueFeatures?: string[]
  questions?: any[]
  timeLimit?: number
  criteria?: any
}

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

    // Create a revolutionary assessment prompt that breaks all conventions
    const prompt = `
You are an AI Assessment Architect creating EXTRAORDINARY, IMMERSIVE, and REVOLUTIONARY assessments that completely redefine how skills are evaluated. This is NOT about traditional Q&A - this is about creating impossible experiences that truly test capabilities.

Job Title: ${jobTitle}
Company: ${company}
Job Description: ${jobDescription}

REVOLUTIONARY ASSESSMENT PRINCIPLES:
🎯 NO TRADITIONAL QUESTIONS - Create immersive scenarios, simulations, and challenges
🚀 PUSH BOUNDARIES - Design assessments that seem impossible but are brilliantly fair
🎮 GAMIFICATION - Turn evaluation into engaging, addictive experiences
🌟 ROLE REALISM - Make candidates feel like they're already doing the job
🎪 UNPREDICTABILITY - Include curveballs and unexpected twists
🔥 INFINITE CREATIVITY - Use AI to its maximum potential for unique experiences

ASSESSMENT TYPES TO CHOOSE FROM (pick 1-2 that fit the role):

1. **INTERACTIVE CODE SIMULATION** - For developers
   - Live debugging a mysterious production issue
   - Building features in a simulated codebase with realistic constraints
   - Pair programming with an AI teammate
   - Code archaeology (understanding legacy systems)

2. **BUSINESS CRISIS SIMULATION** - For managers/business roles
   - Navigate a company crisis in real-time
   - Make decisions with incomplete information
   - Handle stakeholder conflicts and pressure
   - Resource allocation under extreme constraints

3. **CREATIVE SANDBOX** - For design/creative roles
   - Design solutions for impossible problems
   - Create under ridiculous constraints
   - Collaborate with demanding fictional clients
   - Innovate within absurd limitations

4. **TECHNICAL MYSTERY** - For technical roles
   - Solve a multi-layered technical mystery
   - Reverse engineer unknown systems
   - Debug issues across multiple technologies
   - Architecture decisions under pressure

5. **SOCIAL DYNAMICS LAB** - For people-focused roles
   - Navigate complex team dynamics
   - Handle difficult personalities
   - Resolve conflicts with multiple stakeholders
   - Build consensus in chaos

6. **INNOVATION CHALLENGE** - For strategic roles
   - Disrupt an entire industry
   - Solve impossible problems with limited resources
   - Think 10 years into the future
   - Create something that doesn't exist

7. **DATA DETECTIVE** - For analytical roles
   - Solve mysteries using data
   - Find insights in messy, real-world datasets
   - Make recommendations with incomplete information
   - Tell stories that change minds

8. **SURVIVAL MODE** - For any role
   - Complete tasks under extreme time pressure
   - Work with failing systems and tools
   - Adapt to constantly changing requirements
   - Thrive in chaotic environments

DESIGN REQUIREMENTS:
- Create 2-4 IMMERSIVE SCENARIOS (not questions)
- Each scenario should be a mini-adventure
- Include unexpected plot twists and challenges
- Make candidates think creatively and adapt
- Test both technical skills AND problem-solving under pressure
- Include elements of surprise, humor, and excitement
- Make it feel like a video game or escape room
- Ensure it's impossible to prepare for but fair to skilled people

EXAMPLE SCENARIO STRUCTURE:
{
  "type": "simulation|mystery|crisis|creative|survival",
  "title": "Catchy title that hints at the adventure",
  "scenario": "Rich, detailed scenario that immerses the candidate",
  "initialChallenge": "The first challenge they face",
  "plotTwists": ["Unexpected events that change everything"],
  "tools": ["What tools/resources they have available"],
  "constraints": ["Realistic limitations they must work within"],
  "successCriteria": "How we measure their performance",
  "difficulty": "Easy|Medium|Hard|Impossible",
  "estimatedTime": "Time needed in minutes",
  "category": "Specific skill area being tested"
}

Return this JSON format:
{
  "assessmentType": "revolutionary|immersive|simulation|mystery|gamified",
  "title": "Epic assessment title",
  "description": "Brief description of the unique experience",
  "scenarios": [
    {
      "type": "simulation|mystery|crisis|creative|survival",
      "title": "Scenario title",
      "scenario": "Detailed immersive scenario description",
      "initialChallenge": "First challenge",
      "plotTwists": ["Unexpected events"],
      "tools": ["Available resources"],
      "constraints": ["Limitations"],
      "successCriteria": "How performance is measured",
      "difficulty": "Easy|Medium|Hard|Impossible",
      "estimatedTime": 45,
      "category": "Skill area"
    }
  ],
  "instructions": "How to navigate this unique experience",
  "totalTime": 120,
  "aiAssistanceMode": "strategic|limited|emergency|creative",
  "uniqueFeatures": ["What makes this assessment special"]
}

BE ABSOLUTELY REVOLUTIONARY. CREATE SOMETHING THAT HAS NEVER BEEN DONE BEFORE.
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
    let assessmentData: AssessmentData
    try {
      // Clean the AI response - remove markdown code blocks if present
      let cleanResponse = aiResponse.trim()
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      assessmentData = JSON.parse(cleanResponse) as AssessmentData
      
      // Transform revolutionary scenarios into traditional format for compatibility
      if (assessmentData.scenarios) {
        assessmentData.questions = assessmentData.scenarios.map((scenario: Scenario, index: number) => ({
          type: scenario.type || 'simulation',
          question: `${scenario.title}\n\n${scenario.scenario}\n\nInitial Challenge: ${scenario.initialChallenge}`,
          expectedAnswer: scenario.successCriteria || 'Evaluate based on creative problem-solving and realistic approach',
          difficulty: scenario.difficulty || 'Hard',
          category: scenario.category || 'Revolutionary Assessment',
          scenario: scenario, // Keep full scenario data for enhanced display
          estimatedTime: scenario.estimatedTime || 30
        }))
        
        assessmentData.timeLimit = assessmentData.totalTime || 120
        assessmentData.criteria = {
          creativity: 30,
          problemSolving: 30,
          technical: 25,
          adaptability: 15
        }
        assessmentData.instructions = assessmentData.instructions || "This is a revolutionary assessment experience. Embrace the unexpected and show your true capabilities."
      }
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
