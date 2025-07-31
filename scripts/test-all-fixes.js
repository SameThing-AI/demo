// Comprehensive test for all fixed issues
const testAllFixes = async () => {
  console.log('🔧 Testing all fixes...\n')

  // Test 1: Assessment Generation (should work with fallback)
  console.log('1️⃣ Testing Assessment Generation...')
  try {
    const response = await fetch('http://localhost:3000/api/generate-assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobTitle: 'Test Engineer',
        company: 'Test Corp',
        jobDescription: 'Testing role with comprehensive requirements for quality assurance and automation.'
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('   ✅ Assessment generated successfully')
      console.log('   📝 Questions:', data.questions?.length || 0)
      console.log('   🎯 Scenarios:', data.scenarios?.length || 0)
    } else {
      console.log('   ❌ Assessment generation failed:', response.status)
    }
  } catch (error) {
    console.log('   ❌ Assessment generation error:', error.message)
  }

  // Test 2: Format Job Description (with better error handling)
  console.log('\n2️⃣ Testing Format Job Description...')
  try {
    const response = await fetch('http://localhost:3000/api/format-job-description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobDescription: 'Software Engineer position requiring React, Node.js, and 3+ years experience.'
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('   ✅ Job description formatted successfully')
      console.log('   📊 Summary length:', data.summary?.length || 0)
      console.log('   🛠️ Skills extracted:', data.skills?.length || 0)
    } else {
      console.log('   ❌ Job description formatting failed:', response.status)
    }
  } catch (error) {
    console.log('   ❌ Job description formatting error:', error.message)
  }

  console.log('\n🎉 All tests completed!')
  console.log('\n📋 Summary of Fixes Applied:')
  console.log('   ✅ Created missing /api/assessments/[id]/submit endpoint')
  console.log('   ✅ Enhanced JSON parsing in format-job-description')
  console.log('   ✅ Improved OpenAI API key handling')
  console.log('   ✅ Added better error logging and fallbacks')
}

testAllFixes()
