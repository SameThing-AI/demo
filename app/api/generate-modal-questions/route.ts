import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { title, company, description, modalType, count = 5 } = await request.json()

    // In a real implementation, you would use OpenAI or another AI service
    // For demo purposes, we'll generate contextual questions

    const questions = generateModalQuestions(title, company, description, modalType, count)

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Error generating modal questions:', error)
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    )
  }
}

function generateModalQuestions(title: string, company: string, description: string, modalType: string, count: number) {
  const videoQuestions = [
    {
      id: '1',
      text: 'Please introduce yourself and walk us through your professional background.',
      type: 'video',
      timeLimit: 120
    },
    {
      id: '2',
      text: 'Describe a challenging project you worked on and how you overcame the obstacles.',
      type: 'video',
      timeLimit: 180
    },
    {
      id: '3',
      text: 'What interests you most about this role and our company? Why do you think you\'d be a good fit?',
      type: 'video',
      timeLimit: 120
    },
    {
      id: '4',
      text: 'Walk us through your problem-solving process when faced with a complex technical challenge.',
      type: 'video',
      timeLimit: 180
    },
    {
      id: '5',
      text: 'Describe a time when you had to work with a difficult team member. How did you handle it?',
      type: 'video',
      timeLimit: 150
    }
  ]

  const audioQuestions = [
    {
      id: '1',
      text: 'Tell us about your professional experience and key achievements.',
      type: 'audio',
      timeLimit: 120
    },
    {
      id: '2',
      text: 'Explain a complex technical concept in simple terms that a non-technical person could understand.',
      type: 'audio',
      timeLimit: 180
    },
    {
      id: '3',
      text: 'Describe your ideal work environment and team dynamics.',
      type: 'audio',
      timeLimit: 120
    },
    {
      id: '4',
      text: 'What are your long-term career goals and how does this position align with them?',
      type: 'audio',
      timeLimit: 150
    },
    {
      id: '5',
      text: 'Describe a time when you had to learn a new technology or skill quickly.',
      type: 'audio',
      timeLimit: 180
    }
  ]

  const roleSpecificQuestions = generateRoleSpecificQuestions(title, description)
  
  let baseQuestions = modalType === 'video' ? videoQuestions : audioQuestions
  
  if (modalType === 'both') {
    baseQuestions = [
      ...videoQuestions.slice(0, Math.ceil(count / 2)),
      ...audioQuestions.slice(0, Math.floor(count / 2))
    ]
  }

  // Mix in role-specific questions
  const finalQuestions = [...baseQuestions.slice(0, count - 1), ...roleSpecificQuestions.slice(0, 1)]
  
  return finalQuestions.slice(0, count).map((q, index) => ({
    ...q,
    id: String(index + 1)
  }))
}

function generateRoleSpecificQuestions(title: string, description: string) {
  const lowerTitle = title.toLowerCase()
  const lowerDesc = description.toLowerCase()

  if (lowerTitle.includes('developer') || lowerTitle.includes('engineer')) {
    return [
      {
        id: 'role-1',
        text: 'Explain your approach to code review and maintaining code quality in a team environment.',
        type: 'video',
        timeLimit: 180
      },
      {
        id: 'role-2',
        text: 'Describe a time when you had to debug a particularly challenging issue. Walk us through your process.',
        type: 'video',
        timeLimit: 200
      }
    ]
  }

  if (lowerTitle.includes('manager') || lowerTitle.includes('lead')) {
    return [
      {
        id: 'role-1',
        text: 'Describe your leadership style and how you motivate team members.',
        type: 'video',
        timeLimit: 180
      },
      {
        id: 'role-2',
        text: 'Tell us about a difficult decision you had to make as a leader and its outcome.',
        type: 'video',
        timeLimit: 200
      }
    ]
  }

  if (lowerTitle.includes('designer') || lowerTitle.includes('ux') || lowerTitle.includes('ui')) {
    return [
      {
        id: 'role-1',
        text: 'Walk us through your design process from initial research to final implementation.',
        type: 'video',
        timeLimit: 200
      },
      {
        id: 'role-2',
        text: 'Describe a time when you had to advocate for user needs against business constraints.',
        type: 'video',
        timeLimit: 180
      }
    ]
  }

  if (lowerTitle.includes('sales') || lowerTitle.includes('marketing')) {
    return [
      {
        id: 'role-1',
        text: 'Describe your approach to understanding and connecting with potential customers.',
        type: 'video',
        timeLimit: 180
      },
      {
        id: 'role-2',
        text: 'Tell us about a time when you turned a challenging prospect into a successful sale.',
        type: 'video',
        timeLimit: 200
      }
    ]
  }

  // Default questions
  return [
    {
      id: 'role-1',
      text: 'What specific skills and experiences make you uniquely qualified for this role?',
      type: 'video',
      timeLimit: 180
    },
    {
      id: 'role-2',
      text: 'Describe a professional achievement you\'re most proud of and why.',
      type: 'video',
      timeLimit: 180
    }
  ]
}
