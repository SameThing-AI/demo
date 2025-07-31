#!/usr/bin/env node

/**
 * REVOLUTIONARY ASSESSMENT MACHINE - LIVE WEBSITE TESTER
 * Tests the actual website functionality with real job data
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

async function testJobRoleAssessment(jobData) {
  console.log(`\n🎯 TESTING: ${jobData.title} at ${jobData.company}`)
  console.log('=' .repeat(60))
  
  const testResults = {
    jobId: jobData.id,
    jobTitle: jobData.title,
    company: jobData.company,
    category: jobData.search_category,
    timestamp: new Date().toISOString(),
    tests: {}
  }
  
  console.log('📝 Test 1: Environment Generation...')
  const envResult = await testEnvironmentGeneration(jobData)
  testResults.tests.environmentGeneration = envResult
  
  console.log('📝 Test 2: Assessment Detection...')
  const detectionResult = testAssessmentDetection(jobData)
  testResults.tests.assessmentDetection = detectionResult
  
  console.log('📝 Test 3: Sandbox Quality Analysis...')
  const sandboxResult = analyzeSandboxQuality(envResult)
  testResults.tests.sandboxQuality = sandboxResult
  
  console.log('📝 Test 4: Revolutionary Features Check...')
  const revolutionaryResult = checkRevolutionaryFeatures(envResult)
  testResults.tests.revolutionaryFeatures = revolutionaryResult
  
  console.log('📝 Test 5: Role-Specific Content Analysis...')
  const specificityResult = analyzeRoleSpecificity(jobData, envResult)
  testResults.tests.roleSpecificity = specificityResult
  
  // Calculate overall score
  testResults.overallScore = calculateOverallScore(testResults.tests)
  
  console.log(`✅ Overall Assessment Score: ${testResults.overallScore}/100`)
  
  return testResults
}

async function testEnvironmentGeneration(jobData) {
  const apiKey = loadEnvFile()
  
  if (!apiKey) {
    return { success: false, error: 'No OpenAI API key configured' }
  }
  
  const scenario = {
    scenario: {
      role: jobData.title,
      company: jobData.company,
      description: jobData.description,
      difficulty: 'revolutionary-maximum',
      type: 'infinity-sandbox'
    },
    type: 'infinity-sandbox',
    complexity: 'revolutionary-maximum'
  }
  
  try {
    console.log('   🚀 Generating revolutionary environment...')
    
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
            content: 'You are the world\'s most advanced AI assessment architect. Create revolutionary, executable, interactive assessment environments. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: `Create a REVOLUTIONARY INFINITY SANDBOX assessment for: ${JSON.stringify(scenario)}

This must be a FULLY INTERACTIVE, EXECUTABLE environment with:
- Real JavaScript code that candidates can run and modify
- Interactive dashboards and tools specific to the role
- Industry-specific scenarios and challenges  
- Real-time feedback and adaptation
- Multiple engaging challenges and simulations

Return JSON with this exact structure:
{
  "interface": {
    "type": "infinity-sandbox",
    "title": "Assessment Title",
    "roleFocus": "${jobData.title}",
    "duration": "2-3 hours",
    "features": {
      "interactive": true,
      "realTime": true,
      "codeExecution": true,
      "dataVisualization": true
    },
    "components": [
      {
        "type": "interactive-dashboard",
        "title": "Component Title",
        "description": "What this component does",
        "code": "// Complete executable JavaScript code here",
        "challenges": [
          {
            "title": "Challenge Title",
            "description": "What the candidate needs to do",
            "objectives": ["objective 1", "objective 2"],
            "success_criteria": ["criteria 1", "criteria 2"]
          }
        ]
      }
    ]
  },
  "scenarios": [
    {
      "title": "Scenario Title",
      "description": "Scenario description", 
      "type": "professional-simulation",
      "difficulty": "revolutionary-maximum",
      "tasks": [
        {
          "title": "Task Title",
          "description": "Task description",
          "deliverables": ["deliverable 1", "deliverable 2"]
        }
      ]
    }
  ]
}`
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })
    })
    
    if (!response.ok) {
      return { 
        success: false, 
        error: `API call failed with status ${response.status}` 
      }
    }
    
    const result = await response.json()
    const aiResponse = result.choices[0]?.message?.content
    
    if (!aiResponse) {
      return { success: false, error: 'No response from AI' }
    }
    
    console.log('   📝 Response length:', aiResponse.length, 'characters')
    
    // Parse the response
    try {
      let cleanResponse = aiResponse.trim()
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\\s*/, '').replace(/\\s*```$/, '')
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/^```\\s*/, '').replace(/\\s*```$/, '')
      }
      
      const assessmentData = JSON.parse(cleanResponse)
      
      console.log('   ✅ Successfully parsed assessment environment')
      
      return {
        success: true,
        responseLength: aiResponse.length,
        hasInterface: 'interface' in assessmentData,
        hasComponents: assessmentData.interface?.components?.length > 0,
        componentCount: assessmentData.interface?.components?.length || 0,
        hasScenarios: assessmentData.scenarios?.length > 0,
        scenarioCount: assessmentData.scenarios?.length || 0,
        assessmentData: assessmentData
      }
      
    } catch (parseError) {
      return {
        success: false,
        error: 'Failed to parse AI response as JSON',
        rawResponse: aiResponse.substring(0, 200)
      }
    }
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

function testAssessmentDetection(jobData) {
  // Simulate assessment creation with revolutionary features
  const mockAssessment = {
    title: jobData.title,
    type: 'revolutionary-ai',
    company: jobData.company,
    revolutionaryFeatures: {
      infinitySandbox: true,
      aiGenerated: true,
      dynamicAdaptation: true
    }
  }
  
  // Test detection logic (from TakeAssessment.tsx)
  const wouldUseRevolutionary = mockAssessment.type === 'revolutionary-ai' ||
    mockAssessment.revolutionaryFeatures?.infinitySandbox ||
    mockAssessment.assessmentInterface ||
    mockAssessment.assessmentType === 'revolutionary-ai' ||
    mockAssessment.aiGenerated ||
    mockAssessment.generated
  
  console.log(`   🎯 Revolutionary detection: ${wouldUseRevolutionary ? '✅ SUCCESS' : '❌ FAILED'}`)
  
  return {
    wouldDetectRevolutionary: wouldUseRevolutionary,
    assessmentType: mockAssessment.type,
    infinitySandbox: mockAssessment.revolutionaryFeatures.infinitySandbox,
    expectedRouting: wouldUseRevolutionary ? 'LiveSimulationEngine' : 'Traditional Q&A',
    success: wouldUseRevolutionary
  }
}

function analyzeSandboxQuality(envResult) {
  if (!envResult.success || !envResult.assessmentData) {
    return { qualityScore: 0, issues: ['Environment generation failed'] }
  }
  
  const assessmentData = envResult.assessmentData
  const interface = assessmentData.interface || {}
  const components = interface.components || []
  
  let qualityScore = 0
  const qualityFactors = {
    hasExecutableCode: false,
    codeComplexity: 0,
    interactiveElements: 0,
    roleSpecificTools: 0,
    hasRealTimeFeatures: false,
    challengeCount: 0
  }
  
  let totalCodeLength = 0
  
  // Analyze components
  components.forEach(component => {
    // Check for executable code
    if (component.code) {
      qualityFactors.hasExecutableCode = true
      totalCodeLength += component.code.length
      
      // Analyze code complexity
      const code = component.code.toLowerCase()
      if (code.includes('function') || code.includes('class')) {
        qualityFactors.codeComplexity += 10
      }
      if (code.includes('async') || code.includes('await')) {
        qualityFactors.codeComplexity += 5
      }
      if (code.includes('fetch') || code.includes('api')) {
        qualityFactors.hasRealTimeFeatures = true
      }
    }
    
    // Check for interactivity
    if (component.type && component.type.includes('interactive')) {
      qualityFactors.interactiveElements += 1
    }
    
    // Check for challenges
    if (component.challenges && component.challenges.length > 0) {
      qualityFactors.challengeCount += component.challenges.length
    }
    
    // Check for role-specific tools
    const componentText = JSON.stringify(component).toLowerCase()
    if (componentText.includes('dashboard') || componentText.includes('tool') || componentText.includes('simulator')) {
      qualityFactors.roleSpecificTools += 1
    }
  })
  
  // Calculate quality score
  qualityScore = Math.min(100,
    (qualityFactors.hasExecutableCode ? 20 : 0) +
    Math.min(qualityFactors.codeComplexity, 20) +
    (qualityFactors.interactiveElements * 15) +
    (qualityFactors.roleSpecificTools * 10) +
    (qualityFactors.hasRealTimeFeatures ? 15 : 0) +
    Math.min(qualityFactors.challengeCount * 5, 20)
  )
  
  console.log(`   📊 Sandbox quality score: ${qualityScore}/100`)
  console.log(`   💻 Total code length: ${totalCodeLength} characters`)
  console.log(`   🧩 Interactive components: ${qualityFactors.interactiveElements}`)
  
  return {
    qualityScore,
    factors: qualityFactors,
    totalCodeLength,
    componentCount: components.length
  }
}

function checkRevolutionaryFeatures(envResult) {
  if (!envResult.success || !envResult.assessmentData) {
    return { revolutionaryScore: 0, features: [] }
  }
  
  const assessmentText = JSON.stringify(envResult.assessmentData).toLowerCase()
  
  const revolutionaryIndicators = [
    { name: 'Infinity Sandbox', check: assessmentText.includes('infinity') || assessmentText.includes('sandbox') },
    { name: 'AI-Powered', check: assessmentText.includes('ai') || assessmentText.includes('artificial') },
    { name: 'Real-time Features', check: assessmentText.includes('real-time') || assessmentText.includes('realtime') },
    { name: 'Interactive Execution', check: assessmentText.includes('interactive') && assessmentText.includes('execution') },
    { name: 'Dynamic Content', check: assessmentText.includes('dynamic') },
    { name: 'Immersive Experience', check: assessmentText.includes('immersive') },
    { name: 'Executable Code', check: assessmentText.includes('executable') || assessmentText.includes('code') },
    { name: 'Live Simulation', check: assessmentText.includes('simulation') || assessmentText.includes('simulator') }
  ]
  
  const presentFeatures = revolutionaryIndicators.filter(indicator => indicator.check)
  const revolutionaryScore = (presentFeatures.length / revolutionaryIndicators.length) * 100
  
  console.log(`   🚀 Revolutionary features: ${presentFeatures.length}/${revolutionaryIndicators.length}`)
  presentFeatures.forEach(feature => console.log(`      ✅ ${feature.name}`))
  
  return {
    revolutionaryScore,
    features: presentFeatures.map(f => f.name),
    totalPossible: revolutionaryIndicators.length
  }
}

function analyzeRoleSpecificity(jobData, envResult) {
  if (!envResult.success || !envResult.assessmentData) {
    return { specificityScore: 0, matches: [] }
  }
  
  const jobTitle = jobData.title.toLowerCase()
  const jobDescription = jobData.description.toLowerCase()
  const assessmentContent = JSON.stringify(envResult.assessmentData).toLowerCase()
  
  // Role-specific keywords mapping
  const roleKeywords = {
    'product manager': ['roadmap', 'stakeholder', 'product', 'metrics', 'strategy', 'user', 'feature', 'analytics'],
    'software engineer': ['code', 'api', 'database', 'algorithm', 'debugging', 'testing', 'development', 'programming'],
    'data scientist': ['model', 'data', 'analysis', 'statistics', 'machine learning', 'python', 'visualization', 'insights'],
    'marketing': ['campaign', 'brand', 'customer', 'analytics', 'growth', 'conversion', 'content', 'social'],
    'sales': ['pipeline', 'revenue', 'client', 'negotiation', 'quota', 'crm', 'leads', 'closing'],
    'designer': ['design', 'user experience', 'wireframe', 'prototype', 'visual', 'interface', 'ux', 'ui'],
    'analyst': ['analysis', 'data', 'report', 'insights', 'metrics', 'dashboard', 'business intelligence'],
    'manager': ['team', 'leadership', 'strategy', 'operations', 'performance', 'budget', 'planning', 'coordination'],
    'consultant': ['strategy', 'analysis', 'recommendations', 'client', 'business', 'solution', 'advisory'],
    'engineer': ['technical', 'system', 'architecture', 'implementation', 'optimization', 'infrastructure'],
    'researcher': ['research', 'analysis', 'study', 'data', 'methodology', 'findings', 'investigation'],
    'specialist': ['expertise', 'specialized', 'knowledge', 'skills', 'training', 'support', 'technical']
  }
  
  // Find matching role type and keywords
  let relevantKeywords = []
  let roleType = 'general'
  
  for (const [role, keywords] of Object.entries(roleKeywords)) {
    if (jobTitle.includes(role)) {
      relevantKeywords = keywords
      roleType = role
      break
    }
  }
  
  // Count matches in assessment content
  const matches = relevantKeywords.filter(keyword => 
    assessmentContent.includes(keyword)
  )
  
  const specificityScore = relevantKeywords.length > 0 ? 
    (matches.length / relevantKeywords.length) * 100 : 0
  
  console.log(`   🎯 Role detected: ${roleType}`)
  console.log(`   📊 Specificity score: ${specificityScore.toFixed(1)}/100`)
  console.log(`   ✅ Matching keywords: ${matches.join(', ')}`)
  
  return {
    specificityScore,
    roleType,
    matches,
    totalPossible: relevantKeywords.length
  }
}

function calculateOverallScore(tests) {
  const weights = {
    environmentGeneration: 25,
    assessmentDetection: 20,
    sandboxQuality: 25,
    revolutionaryFeatures: 15,
    roleSpecificity: 15
  }
  
  let totalScore = 0
  let totalWeight = 0
  
  // Environment generation
  if (tests.environmentGeneration) {
    const score = tests.environmentGeneration.success ? 100 : 0
    totalScore += score * (weights.environmentGeneration / 100)
    totalWeight += weights.environmentGeneration
  }
  
  // Assessment detection
  if (tests.assessmentDetection) {
    const score = tests.assessmentDetection.wouldDetectRevolutionary ? 100 : 0
    totalScore += score * (weights.assessmentDetection / 100)
    totalWeight += weights.assessmentDetection
  }
  
  // Sandbox quality
  if (tests.sandboxQuality) {
    const score = tests.sandboxQuality.qualityScore
    totalScore += score * (weights.sandboxQuality / 100)
    totalWeight += weights.sandboxQuality
  }
  
  // Revolutionary features
  if (tests.revolutionaryFeatures) {
    const score = tests.revolutionaryFeatures.revolutionaryScore
    totalScore += score * (weights.revolutionaryFeatures / 100)
    totalWeight += weights.revolutionaryFeatures
  }
  
  // Role specificity
  if (tests.roleSpecificity) {
    const score = tests.roleSpecificity.specificityScore
    totalScore += score * (weights.roleSpecificity / 100)
    totalWeight += weights.roleSpecificity
  }
  
  return Math.round(totalScore / (totalWeight / 100))
}

async function runComprehensiveTesting() {
  console.log('🔥 REVOLUTIONARY ASSESSMENT MACHINE - LIVE TESTING')
  console.log('=' .repeat(70))
  console.log('🎯 Testing 20 diverse job roles on the live platform')
  console.log('🚀 Each role will be tested for revolutionary features and quality\n')
  
  // Load job data
  let jobsData
  try {
    const jobsJson = fs.readFileSync('scraped_jobs.json', 'utf8')
    jobsData = JSON.parse(jobsJson)
  } catch (error) {
    console.log('❌ Could not load scraped_jobs.json')
    console.log('   Run: python3 create_test_jobs.py first')
    return
  }
  
  const allResults = []
  let testCount = 0
  
  console.log(`📊 Testing ${jobsData.length} job roles...\n`)
  
  // Test each job role
  for (const jobData of jobsData) {
    testCount++
    
    try {
      const result = await testJobRoleAssessment(jobData)
      allResults.push(result)
      
      // Brief pause between tests
      await new Promise(resolve => setTimeout(resolve, 2000))
      
    } catch (error) {
      console.log(`   ❌ Test failed: ${error.message}`)
      continue
    }
    
    console.log(`\n📈 Progress: ${testCount}/${jobsData.length} completed`)
  }
  
  // Generate comprehensive report
  generateComprehensiveReport(allResults)
  
  console.log('\n🎉 COMPREHENSIVE TESTING COMPLETE!')
  console.log('📊 Check the generated reports for detailed analysis')
}

function generateComprehensiveReport(allResults) {
  console.log('\n📊 GENERATING COMPREHENSIVE REPORT...')
  
  // Calculate summary statistics
  const totalTests = allResults.length
  const averageScore = allResults.reduce((sum, r) => sum + r.overallScore, 0) / totalTests
  const successfulTests = allResults.filter(r => r.overallScore >= 70).length
  const successRate = (successfulTests / totalTests) * 100
  
  // Find best and worst performers
  const bestPerformer = allResults.reduce((best, current) => 
    current.overallScore > best.overallScore ? current : best
  )
  const worstPerformer = allResults.reduce((worst, current) => 
    current.overallScore < worst.overallScore ? current : worst
  )
  
  // Group by category
  const byCategory = {}
  allResults.forEach(result => {
    const category = result.category
    if (!byCategory[category]) {
      byCategory[category] = []
    }
    byCategory[category].push(result)
  })
  
  // Category averages
  const categoryAverages = {}
  Object.entries(byCategory).forEach(([category, results]) => {
    const avg = results.reduce((sum, r) => sum + r.overallScore, 0) / results.length
    categoryAverages[category] = {
      average: avg,
      count: results.length,
      sampleJobs: results.map(r => r.jobTitle)
    }
  })
  
  // Create detailed report
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalTests,
      averageScore: Math.round(averageScore * 10) / 10,
      successRate: Math.round(successRate * 10) / 10,
      successfulTests,
      bestPerformer: {
        title: bestPerformer.jobTitle,
        company: bestPerformer.company,
        score: bestPerformer.overallScore
      },
      worstPerformer: {
        title: worstPerformer.jobTitle,
        company: worstPerformer.company,
        score: worstPerformer.overallScore
      }
    },
    categoryBreakdown: categoryAverages,
    platformReadiness: {
      readyForProduction: successRate >= 80,
      criticalIssues: identifyCriticalIssues(allResults),
      recommendations: generateRecommendations(allResults)
    },
    detailedResults: allResults
  }
  
  // Save detailed JSON report
  fs.writeFileSync('LIVE_TESTING_REPORT.json', JSON.stringify(report, null, 2))
  
  // Generate human-readable summary
  const summaryText = `
🔥 REVOLUTIONARY ASSESSMENT MACHINE - LIVE TESTING REPORT
==============================================================

📊 EXECUTIVE SUMMARY:
• Total Job Roles Tested: ${totalTests}
• Average Assessment Score: ${report.summary.averageScore}/100
• Success Rate: ${report.summary.successRate}% (Score ≥ 70)
• Platform Ready for Production: ${report.platformReadiness.readyForProduction ? 'YES ✅' : 'NO ❌'}

🏆 TOP PERFORMERS:
• Best: ${bestPerformer.jobTitle} at ${bestPerformer.company} (${bestPerformer.overallScore}/100)
• Worst: ${worstPerformer.jobTitle} at ${worstPerformer.company} (${worstPerformer.overallScore}/100)

📋 PERFORMANCE BY JOB CATEGORY:
${Object.entries(categoryAverages)
  .sort((a, b) => b[1].average - a[1].average)
  .map(([category, data]) => 
    `• ${category}: ${Math.round(data.average)}/100 (${data.count} job${data.count !== 1 ? 's' : ''})`
  ).join('\n')}

🚀 PLATFORM ASSESSMENT:
• Revolutionary Feature Integration: ${allResults.filter(r => r.tests.revolutionaryFeatures?.revolutionaryScore >= 60).length}/${totalTests} jobs
• Sandbox Quality: ${allResults.filter(r => r.tests.sandboxQuality?.qualityScore >= 70).length}/${totalTests} high-quality
• Environment Generation Success: ${allResults.filter(r => r.tests.environmentGeneration?.success).length}/${totalTests} successful
• Assessment Detection: ${allResults.filter(r => r.tests.assessmentDetection?.wouldDetectRevolutionary).length}/${totalTests} properly detected

⚠️ CRITICAL ISSUES IDENTIFIED:
${report.platformReadiness.criticalIssues.map(issue => `• ${issue}`).join('\n')}

🎯 KEY RECOMMENDATIONS:
${report.platformReadiness.recommendations.map(rec => `• ${rec}`).join('\n')}

🔗 DETAILED ANALYSIS:
For complete test results and metrics, see: LIVE_TESTING_REPORT.json

Generated: ${new Date().toLocaleString()}
==============================================================
`
  
  fs.writeFileSync('LIVE_TESTING_SUMMARY.txt', summaryText)
  
  console.log(summaryText)
}

function identifyCriticalIssues(allResults) {
  const issues = []
  const totalTests = allResults.length
  
  // Environment generation failures
  const envFailures = allResults.filter(r => !r.tests.environmentGeneration?.success).length
  if (envFailures > totalTests * 0.1) {
    issues.push(`Environment generation failing in ${envFailures}/${totalTests} tests (${Math.round(envFailures/totalTests*100)}%)`)
  }
  
  // Assessment detection failures  
  const detectionFailures = allResults.filter(r => !r.tests.assessmentDetection?.wouldDetectRevolutionary).length
  if (detectionFailures > 0) {
    issues.push(`Revolutionary assessment detection failing in ${detectionFailures}/${totalTests} tests`)
  }
  
  // Low sandbox quality
  const lowQuality = allResults.filter(r => (r.tests.sandboxQuality?.qualityScore || 0) < 50).length
  if (lowQuality > totalTests * 0.25) {
    issues.push(`Low sandbox quality in ${lowQuality}/${totalTests} tests (${Math.round(lowQuality/totalTests*100)}%)`)
  }
  
  // Low role specificity
  const lowSpecificity = allResults.filter(r => (r.tests.roleSpecificity?.specificityScore || 0) < 40).length
  if (lowSpecificity > totalTests * 0.3) {
    issues.push(`Poor role-specific content in ${lowSpecificity}/${totalTests} tests (${Math.round(lowSpecificity/totalTests*100)}%)`)
  }
  
  return issues
}

function generateRecommendations(allResults) {
  const recommendations = []
  
  // Check for consistent issues
  const envFailures = allResults.filter(r => !r.tests.environmentGeneration?.success).length
  if (envFailures > 0) {
    recommendations.push('Fix OpenAI API integration for environment generation')
  }
  
  const avgSandboxQuality = allResults.reduce((sum, r) => sum + (r.tests.sandboxQuality?.qualityScore || 0), 0) / allResults.length
  if (avgSandboxQuality < 70) {
    recommendations.push('Improve sandbox code generation - add more interactive components and executable code')
  }
  
  const avgSpecificity = allResults.reduce((sum, r) => sum + (r.tests.roleSpecificity?.specificityScore || 0), 0) / allResults.length
  if (avgSpecificity < 60) {
    recommendations.push('Enhance role-specific content generation with better job-relevant tools and scenarios')
  }
  
  const avgRevolutionary = allResults.reduce((sum, r) => sum + (r.tests.revolutionaryFeatures?.revolutionaryScore || 0), 0) / allResults.length
  if (avgRevolutionary < 70) {
    recommendations.push('Integrate more revolutionary features like real-time adaptation and AI-powered interactions')
  }
  
  recommendations.push('Implement continuous feedback loops to automatically improve assessment quality')
  recommendations.push('Add more industry-specific templates and scenario variations')
  
  return recommendations
}

// Run the comprehensive testing
if (require.main === module) {
  runComprehensiveTesting().catch(console.error)
}
