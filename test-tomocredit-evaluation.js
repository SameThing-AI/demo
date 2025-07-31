#!/usr/bin/env node

/**
 * TomoCredit Assessment Evaluation Test
 * Tests what evaluation scores are generated for TomoCredit Product Manager assessment
 */

const fs = require('fs')
const path = require('path')

function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '.env.local')
    const envContent = fs.readFileSync(envPath, 'utf8')
    const lines = envContent.split('\n')
    
    for (const line of lines) {
      if (line.includes('OPENAI_API_KEY') && line.includes('=')) {
        const value = line.split('=')[1].replace(/"/g, '').trim()
        return value
      }
    }
  } catch (error) {
    console.log('Could not read .env.local file')
  }
  return null
}

async function testTomoEvaluation() {
  console.log('🎯 TOMOCREDIT PRODUCT MANAGER - EVALUATION TEST')
  console.log('=' .repeat(60))
  
  const apiKey = loadEnvFile()
  
  if (!apiKey || apiKey === 'your-openai-api-key-here') {
    console.log('❌ OpenAI API key not properly configured')
    return
  }
  
  console.log('✅ OpenAI API key configured:', apiKey.substring(0, 10) + '...')
  
  // Simulate a completed TomoCredit Product Manager assessment
  const testEvaluationData = {
    assessmentData: {
      title: 'Product Manager - TomoCredit',
      type: 'revolutionary-ai',
      company: 'TomoCredit',
      description: 'Revolutionary FinTech Product Manager assessment with infinity sandbox environment focusing on credit system innovation, product roadmapping, stakeholder management, and data-driven decision making.',
      questions: [
        {
          id: 1,
          question: 'Design and implement a product roadmap for TomoCredit\'s next-generation credit system',
          type: 'infinity-sandbox',
          points: 100
        }
      ],
      duration: 180,
      revolutionaryFeatures: {
        infinitySandbox: true,
        aiGenerated: true,
        dynamicAdaptation: true,
        fintechFocused: true
      }
    },
    answers: {
      0: {
        response: 'Developed comprehensive product strategy for TomoCredit credit system overhaul',
        productRoadmap: {
          q1_2025: ['Credit Score Algorithm v2.0', 'Mobile App UX Refresh', 'API Integration Framework'],
          q2_2025: ['Real-time Credit Monitoring', 'Personalized Financial Insights', 'Stakeholder Dashboard'],
          q3_2025: ['Machine Learning Risk Assessment', 'Open Banking Integration', 'Regulatory Compliance Updates'],
          q4_2025: ['AI-Powered Financial Advice', 'Cross-Platform Expansion', 'Enterprise Partnerships']
        },
        stakeholderAnalysis: {
          engineering: 'Collaborated on technical feasibility assessment, API design reviews',
          design: 'Conducted user research sessions, wireframe reviews, accessibility audits',
          business: 'Presented ROI analysis, market opportunity assessment, competitive positioning',
          compliance: 'Coordinated regulatory requirements, privacy policy updates, audit preparations'
        },
        dataAnalysis: {
          user_acquisition_cost: '$45 (25% reduction vs industry avg)',
          customer_lifetime_value: '$2,400 (40% above target)',
          churn_rate: '3.2% (industry benchmark: 8.5%)',
          nps_score: 72,
          feature_adoption_rate: '89% for core features'
        },
        technicalCollaboration: {
          api_specifications: 'Defined RESTful API endpoints for credit data access',
          database_schema: 'Collaborated on user data model optimization',
          integration_requirements: 'Specified third-party service integrations (Plaid, Experian)',
          performance_metrics: 'Established SLA requirements: 99.9% uptime, <200ms response time'
        },
        marketResearch: {
          competitor_analysis: 'Analyzed Credit Karma, NerdWallet, Credit Sesame positioning',
          market_size: '$6.8B addressable market in credit monitoring space',
          user_personas: '3 primary personas: Credit Builders, Credit Repairers, Credit Optimizers',
          pain_points: ['Complex credit reports', 'Slow dispute resolution', 'Limited actionable insights']
        },
        execution_time: 135,
        complexity_score: 94,
        innovation_factor: 87
      }
    },
    candidateProfile: {
      name: 'Sarah Chen',
      experience: '6 years Product Management',
      skills: ['Product Strategy', 'Data Analysis', 'Stakeholder Management', 'FinTech', 'Agile', 'User Research'],
      education: 'MBA Stanford, BS Computer Science MIT',
      previousRoles: ['Senior PM at Square', 'PM at Lending Club', 'APM at Google']
    },
    timeSpent: 9720 // 162 minutes
  }
  
  console.log('🚀 Testing evaluation with realistic TomoCredit PM assessment data...\n')
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are the world\'s most advanced AI assessment evaluator and professional excellence analyst. Your evaluations must be precise, insightful, and professionally rigorous, providing comprehensive analysis that identifies true professional competency and potential. Always respond with valid JSON only, no additional text. Your analysis should be detailed, constructive, and calibrated to the highest industry standards.'
          },
          {
            role: 'user',
            content: `Please evaluate this TomoCredit Product Manager assessment completion:

ASSESSMENT DATA: ${JSON.stringify(testEvaluationData.assessmentData)}
CANDIDATE RESPONSES: ${JSON.stringify(testEvaluationData.answers)}
CANDIDATE PROFILE: ${JSON.stringify(testEvaluationData.candidateProfile)}
TIME SPENT: ${testEvaluationData.timeSpent} seconds

This is a revolutionary FinTech Product Manager assessment focusing on:
- Product strategy and roadmap development
- Stakeholder management and cross-functional collaboration  
- Data-driven decision making and analytics
- Technical collaboration with engineering teams
- Market research and competitive analysis
- FinTech industry expertise and credit system knowledge

Please provide a comprehensive evaluation with the following JSON structure:
{
  "totalScore": number (0-100),
  "maxScore": 100,
  "percentage": number (0-100),
  "passed": boolean,
  "grade": "A+/A/A-/B+/B/B-/C+/C/C-/D+/D/F",
  "timeEfficiency": number (0-100),
  "breakdown": {
    "productStrategy": {
      "score": number,
      "max": 25,
      "percentage": number,
      "feedback": "detailed feedback on product strategy and roadmapping skills"
    },
    "stakeholderManagement": {
      "score": number,
      "max": 25, 
      "percentage": number,
      "feedback": "detailed feedback on cross-functional collaboration"
    },
    "dataAnalysis": {
      "score": number,
      "max": 25,
      "percentage": number,
      "feedback": "detailed feedback on analytics and data-driven decisions"
    },
    "technicalCollaboration": {
      "score": number,
      "max": 25,
      "percentage": number,
      "feedback": "detailed feedback on engineering collaboration"
    }
  },
  "questionScores": [
    {
      "questionIndex": 0,
      "score": number,
      "maxScore": 100,
      "percentage": number,
      "feedback": "comprehensive feedback on the infinity sandbox performance",
      "strengths": ["strength 1", "strength 2", "strength 3"],
      "improvements": ["improvement 1", "improvement 2"]
    }
  ],
  "overallFeedback": {
    "strengths": ["top 3-5 strengths demonstrated"],
    "improvements": ["key areas for development"],
    "recommendations": ["specific recommendations for growth"],
    "fitForRole": "assessment of fit for TomoCredit Product Manager role",
    "summary": "comprehensive summary of performance and potential"
  },
  "nextSteps": {
    "recommended": boolean,
    "interviewFocus": ["areas to explore in interviews"],
    "additionalAssessments": ["suggested follow-up assessments"]
  }
}

Evaluate this as a senior FinTech Product Manager assessment with high standards for TomoCredit's innovative credit system work.`
          }
        ],
        temperature: 0.2,
        max_tokens: 4000
      })
    })
    
    if (!response.ok) {
      console.log(`❌ API Error: ${response.status} ${response.statusText}`)
      const errorText = await response.text()
      console.log('Error details:', errorText)
      return
    }
    
    const result = await response.json()
    const aiResponse = result.choices[0]?.message?.content
    
    if (!aiResponse) {
      console.log('❌ No response content from OpenAI')
      return
    }
    
    console.log('✅ Evaluation response received')
    console.log('📝 Response Length:', aiResponse.length)
    
    // Parse the evaluation
    let evaluationResults
    try {
      let cleanResponse = aiResponse.trim()
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      evaluationResults = JSON.parse(cleanResponse)
      console.log('✅ Successfully parsed evaluation results\n')
      
    } catch (parseError) {
      console.log('❌ Failed to parse evaluation:', parseError.message)
      console.log('Raw response:', aiResponse)
      return
    }
    
    // Display evaluation results
    console.log('📊 TOMOCREDIT PRODUCT MANAGER EVALUATION RESULTS:')
    console.log('=' .repeat(55))
    
    console.log(`🎯 Overall Score: ${evaluationResults.totalScore}/${evaluationResults.maxScore} (${evaluationResults.percentage}%)`)
    console.log(`📊 Grade: ${evaluationResults.grade}`)
    console.log(`✅ Passed: ${evaluationResults.passed ? 'YES' : 'NO'}`)
    console.log(`⏱️  Time Efficiency: ${evaluationResults.timeEfficiency}%`)
    
    if (evaluationResults.breakdown) {
      console.log('\n📋 DETAILED BREAKDOWN:')
      Object.entries(evaluationResults.breakdown).forEach(([category, data]) => {
        console.log(`\n  ${category.toUpperCase()}:`)
        console.log(`    Score: ${data.score}/${data.max} (${data.percentage}%)`)
        console.log(`    Feedback: ${data.feedback}`)
      })
    }
    
    if (evaluationResults.questionScores && evaluationResults.questionScores.length > 0) {
      console.log('\n🎮 INFINITY SANDBOX PERFORMANCE:')
      const question = evaluationResults.questionScores[0]
      console.log(`  Score: ${question.score}/${question.maxScore} (${question.percentage}%)`)
      console.log(`  Feedback: ${question.feedback}`)
      
      if (question.strengths && question.strengths.length > 0) {
        console.log(`  Strengths:`)
        question.strengths.forEach(strength => console.log(`    • ${strength}`))
      }
      
      if (question.improvements && question.improvements.length > 0) {
        console.log(`  Areas for Improvement:`)
        question.improvements.forEach(improvement => console.log(`    • ${improvement}`))
      }
    }
    
    if (evaluationResults.overallFeedback) {
      const feedback = evaluationResults.overallFeedback
      console.log('\n🏆 OVERALL ASSESSMENT:')
      console.log(`  Fit for Role: ${feedback.fitForRole}`)
      console.log(`  Summary: ${feedback.summary}`)
      
      if (feedback.strengths && feedback.strengths.length > 0) {
        console.log('\n  💪 Key Strengths:')
        feedback.strengths.forEach(strength => console.log(`    • ${strength}`))
      }
      
      if (feedback.improvements && feedback.improvements.length > 0) {
        console.log('\n  📈 Development Areas:')
        feedback.improvements.forEach(improvement => console.log(`    • ${improvement}`))
      }
      
      if (feedback.recommendations && feedback.recommendations.length > 0) {
        console.log('\n  🎯 Recommendations:')
        feedback.recommendations.forEach(rec => console.log(`    • ${rec}`))
      }
    }
    
    if (evaluationResults.nextSteps) {
      console.log('\n🚀 NEXT STEPS:')
      console.log(`  Recommended for next round: ${evaluationResults.nextSteps.recommended ? 'YES' : 'NO'}`)
      
      if (evaluationResults.nextSteps.interviewFocus && evaluationResults.nextSteps.interviewFocus.length > 0) {
        console.log('  Interview Focus Areas:')
        evaluationResults.nextSteps.interviewFocus.forEach(area => console.log(`    • ${area}`))
      }
    }
    
    console.log('\n🎉 EVALUATION ANALYSIS COMPLETE!')
    
    // Compare with expected ideal
    console.log('\n🏆 EVALUATION QUALITY CHECK:')
    console.log('=' .repeat(35))
    
    const isDynamic = evaluationResults.totalScore !== 85 && evaluationResults.totalScore !== 80
    console.log(`✅ Dynamic Scoring (not fixed 85%): ${isDynamic ? 'YES' : 'NO'}`)
    
    const hasDetailedBreakdown = evaluationResults.breakdown && Object.keys(evaluationResults.breakdown).length >= 4
    console.log(`✅ Detailed Category Breakdown: ${hasDetailedBreakdown ? 'YES' : 'NO'}`)
    
    const hasSpecificFeedback = JSON.stringify(evaluationResults).length > 1000
    console.log(`✅ Comprehensive Feedback: ${hasSpecificFeedback ? 'YES' : 'NO'}`)
    
    const hasRoleSpecificAnalysis = JSON.stringify(evaluationResults).toLowerCase().includes('product') || 
                                   JSON.stringify(evaluationResults).toLowerCase().includes('fintech')
    console.log(`✅ Role-Specific Analysis: ${hasRoleSpecificAnalysis ? 'YES' : 'NO'}`)
    
    console.log('\nThis evaluation would be returned to candidates completing the')
    console.log('TomoCredit Product Manager revolutionary assessment.')
    
  } catch (error) {
    console.log('❌ Evaluation test failed:', error.message)
  }
}

// Run the test
if (require.main === module) {
  testTomoEvaluation().catch(console.error)
}

module.exports = { testTomoEvaluation }
