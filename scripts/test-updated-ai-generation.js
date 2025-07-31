// Test the updated AI assessment generation to check if questions are being created
const testUpdatedAIGeneration = async () => {
  try {
    console.log('🧪 Testing updated AI assessment generation...')
    
    const testData = {
      jobTitle: 'Frontend Developer',
      company: 'DesignTech Solutions',
      jobDescription: 'We are seeking a talented Frontend Developer to join our team. The ideal candidate will have expertise in React, TypeScript, and modern CSS frameworks. Responsibilities include building responsive user interfaces, optimizing web performance, collaborating with UX designers, and ensuring cross-browser compatibility. Strong problem-solving skills and attention to detail are essential.'
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
    
    console.log('✅ Updated AI Assessment Generated!')
    console.log('📊 Assessment Details:')
    console.log('  - Title:', result.title)
    console.log('  - Type:', result.assessmentType)
    console.log('  - Questions Count:', result.questions?.length || 0)
    console.log('  - Scenarios Count:', result.scenarios?.length || 0)
    console.log('  - Interface Components:', result.assessmentInterface?.components?.length || 0)
    
    if (result.questions && result.questions.length > 0) {
      console.log('📝 Generated Questions:')
      result.questions.forEach((q, i) => {
        console.log(`  ${i + 1}. ${q.question}`)
        console.log(`     - Difficulty: ${q.difficulty}`)
        console.log(`     - Time Limit: ${q.timeLimit}s`)
        console.log(`     - Evaluation Points: ${q.evaluation?.rubric?.length || 0}`)
      })
    } else {
      console.log('❌ No questions generated!')
    }
    
    if (result.scenarios && result.scenarios.length > 0) {
      console.log('🎯 Generated Scenarios:')
      result.scenarios.forEach((s, i) => {
        console.log(`  ${i + 1}. ${s.title}: ${s.description}`)
      })
    }
    
    return result
    
  } catch (error) {
    console.error('❌ Test Failed:', error)
    return null
  }
}

// Run the test
testUpdatedAIGeneration()
