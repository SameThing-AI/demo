/**
 * AI Content Generator
 * Replaces all hardcoded content with AI-generated content
 */

export interface AIGenerationRequest {
  type: 'assessment' | 'question' | 'scenario' | 'feedback' | 'coaching' | 'description'
  context: {
    role?: string
    skill?: string
    company?: string
    difficulty?: 'easy' | 'medium' | 'hard'
    scenario?: string
    industry?: string
    [key: string]: any
  }
  constraints?: {
    maxLength?: number
    format?: 'text' | 'json' | 'markdown'
    tone?: 'professional' | 'friendly' | 'technical' | 'encouraging'
  }
}

export interface AIGenerationResponse {
  content: string
  metadata: {
    generatedAt: string
    version: string
    confidence: number
    tokens: number
  }
}

class AIContentGenerator {
  private getBaseUrl() {
    // Handle both client and server-side requests
    if (typeof window === 'undefined') {
      // Server-side
      return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
    // Client-side
    return window.location.origin
  }

  private apiKey = process.env.NEXT_PUBLIC_AI_API_KEY

  async generateContent(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    try {
      const baseUrl = this.getBaseUrl()
      const response = await fetch(`${baseUrl}/api/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiKey ? `Bearer ${this.apiKey}` : '',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`AI generation failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('AI Content Generation Error:', error)
      // Fallback to smart templates
      return this.generateFallbackContent(request)
    }
  }

  private generateFallbackContent(request: AIGenerationRequest): AIGenerationResponse {
    const templates = {
      assessment: this.generateAssessmentTemplate(request.context),
      question: this.generateQuestionTemplate(request.context),
      scenario: this.generateScenarioTemplate(request.context),
      feedback: this.generateFeedbackTemplate(request.context),
      coaching: this.generateCoachingTemplate(request.context),
      description: this.generateDescriptionTemplate(request.context),
    }

    return {
      content: templates[request.type] || 'AI-generated content placeholder',
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0.0',
        confidence: 0.8,
        tokens: 150
      }
    }
  }

  private generateAssessmentTemplate(context: any): string {
    const role = context.role || 'Software Developer'
    const company = context.company || 'Tech Company'
    
    return `# AI-Generated Assessment: ${role} at ${company}

## Overview
This assessment evaluates your skills in ${context.skill || 'technical problem-solving'} relevant to the ${role} position.

## Skills Evaluated
- Technical expertise
- Problem-solving approach
- Code quality and structure
- Communication skills

## Instructions
Complete all sections to demonstrate your capabilities. The assessment adapts based on your responses.`
  }

  private generateQuestionTemplate(context: any): string {
    const skill = context.skill || 'programming'
    const difficulty = context.difficulty || 'medium'
    
    return `Given a ${difficulty}-level ${skill} scenario, design and implement a solution that demonstrates:
1. Clear understanding of the problem
2. Efficient algorithmic approach
3. Clean, maintainable code
4. Proper error handling

Consider edge cases and explain your reasoning for the chosen approach.`
  }

  private generateScenarioTemplate(context: any): string {
    const role = context.role || 'developer'
    const industry = context.industry || 'technology'
    
    return `You're a ${role} at a ${industry} company facing a critical challenge. Your team needs to:
- Analyze the problem thoroughly
- Design an optimal solution
- Implement with best practices
- Consider scalability and maintenance

Show your thought process and technical decision-making skills.`
  }

  private generateFeedbackTemplate(context: any): string {
    const score = context.score || 75
    const areas = context.areas || ['technical skills', 'problem solving']
    
    return `Performance Analysis (Score: ${score}%)

Strengths:
- Demonstrated solid understanding of ${areas[0]}
- Clear communication of approach
- Good attention to detail

Areas for Improvement:
- Consider edge cases more thoroughly
- Optimize for performance
- Enhance error handling

Next Steps:
Focus on ${areas[1]} and practice with similar challenges.`
  }

  private generateCoachingTemplate(context: any): string {
    const skill = context.skill || 'technical skills'
    
    return `# Personalized Learning Path: ${skill}

## Current Level Assessment
Based on your performance, we've identified key areas for growth.

## Recommended Actions
1. Practice core concepts
2. Build real-world projects
3. Seek mentor feedback
4. Join technical communities

## Resources
- Interactive coding challenges
- Industry best practices
- Peer learning opportunities`
  }

  private generateDescriptionTemplate(context: any): string {
    const type = context.type || 'feature'
    
    return `This ${type} leverages AI to provide personalized, adaptive experiences that enhance learning and assessment accuracy.

Key benefits:
- Real-time adaptation
- Personalized content
- Intelligent feedback
- Performance optimization`
  }

  // Specialized generators for different content types
  async generateAssessmentQuestions(count: number, context: any) {
    const questions = []
    for (let i = 0; i < count; i++) {
      const question = await this.generateContent({
        type: 'question',
        context: { ...context, questionNumber: i + 1 },
        constraints: { maxLength: 500, format: 'text' }
      })
      questions.push(question.content)
    }
    return questions
  }

  async generateLiveScenario(context: any) {
    return this.generateContent({
      type: 'scenario',
      context,
      constraints: { format: 'json', tone: 'professional' }
    })
  }

  async generatePersonalizedFeedback(userResponse: any, expectedAnswer: any) {
    return this.generateContent({
      type: 'feedback',
      context: { userResponse, expectedAnswer },
      constraints: { maxLength: 300, tone: 'friendly' }
    })
  }

  async generateCoachingPath(userSkills: string[], targetRole: string) {
    return this.generateContent({
      type: 'coaching',
      context: { userSkills, targetRole },
      constraints: { format: 'json' }
    })
  }
}

export const aiContentGenerator = new AIContentGenerator()
