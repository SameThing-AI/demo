// Test end-to-end assessment creation to verify the form creates assessments with questions
const testEndToEndAssessmentCreation = async () => {
  try {
    console.log('🔄 Testing end-to-end assessment creation...')
    
    // Step 1: Generate assessment via API
    const generateResponse = await fetch('http://localhost:3001/api/generate-assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobTitle: 'UX Designer',
        company: 'Creative Studio',
        jobDescription: 'Looking for an experienced UX Designer to create intuitive user experiences for our digital products. Must have experience with user research, wireframing, prototyping, and usability testing. Strong collaboration skills and ability to work with cross-functional teams required.'
      })
    })
    
    const assessmentData = await generateResponse.json()
    console.log('✅ Step 1: Assessment generated with', assessmentData.questions?.length || 0, 'questions')
    
    // Step 2: Create assessment in database
    const createResponse = await fetch('http://localhost:3001/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: assessmentData.title || 'UX Designer Assessment',
        company: assessmentData.company || 'Creative Studio',
        description: assessmentData.description || 'UX Designer role assessment',
        questions: assessmentData.questions || [],
        duration: assessmentData.timeLimit || 90,
        type: 'ai-powered',
        assessmentInterface: assessmentData.assessmentInterface,
        scenarios: assessmentData.scenarios,
        generated: true
      })
    })
    
    if (!createResponse.ok) {
      throw new Error(`Failed to create assessment: ${createResponse.status}`)
    }
    
    const createdAssessment = await createResponse.json()
    console.log('✅ Step 2: Assessment created with ID:', createdAssessment.id)
    console.log('   - Questions count:', createdAssessment.questions?.length || 0)
    console.log('   - Title:', createdAssessment.title)
    console.log('   - Duration:', createdAssessment.duration, 'minutes')
    
    // Step 3: Verify assessment can be retrieved
    const retrieveResponse = await fetch(`http://localhost:3001/api/assessments/${createdAssessment.id}`)
    const retrievedAssessment = await retrieveResponse.json()
    
    console.log('✅ Step 3: Assessment retrieved successfully')
    console.log('   - Questions available:', retrievedAssessment.questions?.length > 0 ? 'YES' : 'NO')
    console.log('   - Assessment type:', retrievedAssessment.type)
    console.log('   - Can be taken by candidates:', retrievedAssessment.questions?.length > 0 ? 'YES' : 'NO')
    
    if (retrievedAssessment.questions && retrievedAssessment.questions.length > 0) {
      console.log('🎉 SUCCESS: Assessment creation is working properly!')
      console.log('   - Candidates will see', retrievedAssessment.questions.length, 'questions')
      console.log('   - Assessment is fully functional')
    } else {
      console.log('❌ ISSUE: Assessment created but has no questions')
    }
    
    return {
      success: retrievedAssessment.questions?.length > 0,
      assessmentId: createdAssessment.id,
      questionsCount: retrievedAssessment.questions?.length || 0
    }
    
  } catch (error) {
    console.error('❌ End-to-end test failed:', error)
    return { success: false, error: error.message }
  }
}

// Run the test
testEndToEndAssessmentCreation()
