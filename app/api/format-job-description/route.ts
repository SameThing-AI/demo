import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import connectDB from '@/lib/mongodb'
import { Assessment } from '@/models'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { jobDescription, jobTitle, company, assessmentId } = body

    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectDB()

    // Check if we have cached analysis for this assessment
    if (assessmentId) {
      try {
        const assessment = await Assessment.findById(assessmentId)
        if (assessment?.jobAnalysis) {
          console.log('Returning cached job analysis for assessment:', assessmentId)
          return NextResponse.json(assessment.jobAnalysis)
        }
      } catch (error) {
        console.error('Error fetching cached analysis:', error)
        // Continue with AI analysis if cache fails
      }
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        summary: jobDescription.substring(0, 200) + '...',
        skills: ['JavaScript', 'Communication', 'Problem Solving'],
        experience: 'Mid-level',
        location: 'Remote',
        type: 'Full-time'
      })
    }

    const prompt = `
Analyze the following job description and extract key information to help recruiters quickly understand the role:

Job Title: ${jobTitle || 'Not specified'}
Company: ${company || 'Not specified'}
Job Description: ${jobDescription}

Please extract and format the following information in JSON format:
1. A concise summary (2-3 sentences)
2. Required skills (array of 5-8 key skills)
3. Experience level (Entry, Mid-level, Senior, Lead/Principal)
4. Employment type (Full-time, Part-time, Contract, Freelance)
5. Location info if mentioned (Remote, On-site, Hybrid, or specific location)
6. Key benefits if mentioned (array of 3-5 benefits)
7. Team size/structure if mentioned
8. Industry/domain focus

Return in this JSON format:
{
  "summary": "Brief 2-3 sentence summary of the role",
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "experience": "Experience level",
  "type": "Employment type",
  "location": "Location info",
  "benefits": ["benefit1", "benefit2", "benefit3"],
  "teamSize": "Team size info",
  "industry": "Industry/domain"
}
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert HR analyst. Extract key information from job descriptions and format them clearly for recruiters. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 800,
    })

    const aiResponse = completion.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Parse the AI response
    let formattedData
    try {
      // Clean the AI response - remove markdown code blocks if present
      let cleanResponse = aiResponse.trim()
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      // Additional cleaning for common AI response issues
      cleanResponse = cleanResponse.replace(/^[^{]*{/, '{').replace(/}[^}]*$/, '}')
      
      formattedData = JSON.parse(cleanResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      console.error('Raw AI response:', aiResponse)
      
      // Fallback formatting
      formattedData = {
        summary: jobDescription.substring(0, 300) + '...',
        skills: extractBasicSkills(jobDescription),
        experience: extractExperience(jobDescription),
        type: 'Full-time',
        location: extractLocation(jobDescription),
        benefits: [],
        teamSize: 'Not specified',
        industry: 'Technology'
      }
    }

    // Cache the analysis if we have an assessmentId
    if (assessmentId && formattedData) {
      try {
        await Assessment.findByIdAndUpdate(
          assessmentId,
          { jobAnalysis: formattedData },
          { new: true }
        )
        console.log('Cached job analysis for assessment:', assessmentId)
      } catch (cacheError) {
        console.error('Error caching job analysis:', cacheError)
        // Don't fail the request if caching fails
      }
    }

    return NextResponse.json(formattedData)

  } catch (error) {
    console.error('Error formatting job description:', error)
    
    // Return fallback formatting
    const body = await request.json().catch(() => ({}))
    return NextResponse.json({
      summary: body.jobDescription?.substring(0, 300) + '...' || 'Job description not available',
      skills: ['Communication', 'Problem Solving', 'Teamwork'],
      experience: 'Mid-level',
      type: 'Full-time',
      location: 'Not specified',
      benefits: [],
      teamSize: 'Not specified',
      industry: 'Technology'
    })
  }
}

// Fallback functions for basic extraction
function extractBasicSkills(description: string): string[] {
  const skillKeywords = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
    'SQL', 'AWS', 'Docker', 'Kubernetes', 'Git', 'Agile', 'Scrum',
    'Communication', 'Leadership', 'Problem Solving', 'Teamwork'
  ]
  
  return skillKeywords.filter(skill => 
    description.toLowerCase().includes(skill.toLowerCase())
  ).slice(0, 6)
}

function extractExperience(description: string): string {
  const text = description.toLowerCase()
  if (text.includes('senior') || text.includes('lead') || text.includes('principal')) {
    return 'Senior'
  } else if (text.includes('junior') || text.includes('entry') || text.includes('graduate')) {
    return 'Entry'
  } else {
    return 'Mid-level'
  }
}

function extractLocation(description: string): string {
  const text = description.toLowerCase()
  if (text.includes('remote')) return 'Remote'
  if (text.includes('hybrid')) return 'Hybrid'
  if (text.includes('on-site') || text.includes('onsite')) return 'On-site'
  return 'Not specified'
}
