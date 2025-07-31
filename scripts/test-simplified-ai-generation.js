// Test script to verify AI assessment generation with simplified inputs
const testAIAssessmentGeneration = async () => {
  try {
    console.log('🧪 Testing AI assessment generation...')
    
    const testData = {
      jobTitle: 'Senior Product Manager',
      company: 'TechCorp Inc.',
      jobDescription: 'We are looking for a Senior Product Manager to lead our core product initiatives. The ideal candidate will have 5+ years of experience in product management, strong analytical skills, and experience with stakeholder management. Responsibilities include defining product roadmaps, working with engineering teams, conducting market research, and driving product strategy.'
    }
    
    const response = await fetch('http://localhost:3001/api/generate-assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const result = await response.json()
    
    console.log('✅ AI Assessment Generated Successfully!')
    console.log('📊 Assessment Details:')
    console.log('  - Title:', result.title)
    console.log('  - Type:', result.assessmentType)
    console.log('  - Interface Type:', result.assessmentInterface?.type)
    console.log('  - Components:', result.assessmentInterface?.components?.length)
    console.log('  - Scenarios:', result.scenarios?.length)
    console.log('  - AI Generated:', result.generated)
    
    if (result.assessmentInterface) {
      console.log('🎨 Interface Features:')
      console.log('  - Theme:', result.assessmentInterface.styling?.theme)
      console.log('  - Layout:', result.assessmentInterface.styling?.layout)
      console.log('  - Primary Skills:', result.assessmentInterface.evaluation?.primary)
      console.log('  - Components:', result.assessmentInterface.components?.map(c => c.type))
    }
    
    return result
    
  } catch (error) {
    console.error('❌ AI Assessment Generation Failed:', error)
    return null
  }
}

// Run the test
testAIAssessmentGeneration()
