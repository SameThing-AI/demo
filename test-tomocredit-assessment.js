#!/usr/bin/env node

/**
 * TomoCredit Product Manager Assessment Generation Test
 * This script tests what revolutionary assessment environment gets generated
 */

const BASE_URL = 'http://localhost:3000'

const TOMOCREDIT_ROLE = {
  title: 'Product Manager - TomoCredit',
  company: 'TomoCredit',
  description: `Who We Are: As seen on TechCrunch, Forbes, and Bloomberg, join one of fastest growing areas in FinTech by taking on the credit system. Work directly with one of Inc.'s top female founders and learn from some of the most talented people in the industry. Headquartered in San Francisco, Tomo's mission is to replace the outdated credit system and open access to banking.

Key Responsibilities:
- Define and articulate a clear product vision and strategy aligned with company goals
- Conduct market research, competitor analysis, and user feedback to identify opportunities  
- Develop and maintain a detailed product roadmap
- Prioritize features and initiatives based on business value, user impact, and technical feasibility
- Work closely with engineering, design, and other teams to translate requirements into detailed product specifications
- Act as the main point of contact for all stakeholders regarding product development and updates
- Oversee the product lifecycle from concept to launch and beyond
- Track and measure product performance using key metrics and iterate based on data-driven insights
- Champion the voice of the customer and ensure a user-first mindset throughout the development process
- Conduct usability testing and gather feedback to inform product improvements

Qualifications:
- 3-5+ years of experience in product management, with a strong foundation in engineering or a technical role
- Proven track record of launching successful products
- Hands-on experience collaborating with engineering teams and translating technical concepts into actionable product plans
- Strong understanding of product lifecycle management, Agile methodologies, and technical development processes
- Excellent communication, presentation, and stakeholder management skills
- Analytical mindset with experience in data-driven decision-making
- Ability to work effectively with engineering teams and understand technical concepts
- Familiarity with tools like Jira, Confluence, and analytics platforms (e.g., Google Analytics, Mixpanel)

Education: Bachelor's degree in Business, Computer Science, Engineering, or a related field (MBA is a plus)

Soft Skills:
- Being able to adapt and thrive in fast-paced startup environments
- Strong problem-solving abilities and a bias for action
- Team player with a collaborative mindset`,
  difficulty: 'revolutionary-maximum',
  type: 'revolutionary-ai'
}

async function testTomoAssessmentGeneration() {
  console.log('🎯 TESTING TOMOCREDIT PRODUCT MANAGER ASSESSMENT GENERATION')
  console.log('=' .repeat(80))
  
  const testScenario = {
    scenario: TOMOCREDIT_ROLE,
    type: 'infinity-sandbox',
    complexity: 'revolutionary-maximum'
  }
  
  try {
    console.log('🚀 Generating revolutionary assessment for TomoCredit Product Manager...\n')
    
    const response = await fetch(`${BASE_URL}/api/generate-live-environment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testScenario)
    })
    
    if (!response.ok) {
      console.log(`❌ API Error: ${response.status} ${response.statusText}`)
      return
    }
    
    const result = await response.json()
    
    console.log('📊 ASSESSMENT ENVIRONMENT GENERATED:')
    console.log('=' .repeat(50))
    
    // Display the interface details
    if (result.interface) {
      console.log('🎮 INTERFACE TYPE:', result.interface.type || 'Unknown')
      console.log('📝 TITLE:', result.interface.title || 'No title')
      console.log('💼 ROLE FOCUS:', result.interface.roleFocus || 'Not specified')
      console.log('⏱️  DURATION:', result.interface.duration || 'Not specified')
      
      if (result.interface.features) {
        console.log('\n🛠️  FEATURES:')
        Object.entries(result.interface.features).forEach(([key, value]) => {
          console.log(`  - ${key}: ${value}`)
        })
      }
      
      if (result.interface.components && result.interface.components.length > 0) {
        console.log('\n🧩 INTERACTIVE COMPONENTS:')
        result.interface.components.forEach((component, index) => {
          console.log(`\n  ${index + 1}. ${component.type?.toUpperCase() || 'COMPONENT'}`)
          console.log(`     Title: ${component.title || 'No title'}`)
          console.log(`     Description: ${component.description || 'No description'}`)
          
          if (component.code) {
            console.log(`     Code Length: ${component.code.length} characters`)
            console.log(`     Code Preview: ${component.code.substring(0, 100)}...`)
          }
          
          if (component.challenges && component.challenges.length > 0) {
            console.log(`     Challenges: ${component.challenges.length} tasks`)
            component.challenges.forEach((challenge, i) => {
              console.log(`       ${i+1}. ${challenge.title || challenge.description || 'Challenge'}`)
            })
          }
        })
      }
      
      if (result.interface.executionEnvironment) {
        console.log('\n⚡ EXECUTION ENVIRONMENT:')
        console.log(`  - Runtime: ${result.interface.executionEnvironment.runtime || 'Not specified'}`)
        console.log(`  - Features: ${JSON.stringify(result.interface.executionEnvironment.features || {})}`)
      }
    }
    
    // Display scenarios
    if (result.scenarios && result.scenarios.length > 0) {
      console.log('\n🎭 ASSESSMENT SCENARIOS:')
      console.log('=' .repeat(30))
      result.scenarios.forEach((scenario, index) => {
        console.log(`\n${index + 1}. ${scenario.title || 'Scenario'}`)
        console.log(`   Description: ${scenario.description || 'No description'}`)
        console.log(`   Type: ${scenario.type || 'Unknown'}`)
        console.log(`   Difficulty: ${scenario.difficulty || 'Not specified'}`)
        
        if (scenario.tasks && scenario.tasks.length > 0) {
          console.log(`   Tasks: ${scenario.tasks.length} challenges`)
          scenario.tasks.forEach((task, i) => {
            console.log(`     ${i+1}. ${task.title || task.description || 'Task'}`)
          })
        }
      })
    }
    
    console.log('\n🎯 ASSESSMENT ANALYSIS:')
    console.log('=' .repeat(30))
    console.log('✅ Assessment Type:', result.interface?.type === 'infinity-sandbox' ? 'REVOLUTIONARY INFINITY SANDBOX' : 'Traditional')
    console.log('✅ Interactive Elements:', result.interface?.components?.length || 0)
    console.log('✅ Executable Code:', result.interface?.components?.some(c => c.code) ? 'YES' : 'NO')
    console.log('✅ Real-time Features:', result.interface?.features?.realTime ? 'YES' : 'NO')
    console.log('✅ Product Manager Focus:', result.interface?.roleFocus?.includes('Product') ? 'YES' : 'UNCLEAR')
    
    // Verify against ideal requirements
    console.log('\n🏆 IDEAL vs ACTUAL COMPARISON:')
    console.log('=' .repeat(40))
    
    const hasProductRoadmapTool = result.interface?.components?.some(c => 
      c.title?.toLowerCase().includes('roadmap') || 
      c.description?.toLowerCase().includes('roadmap'))
    console.log('📋 Product Roadmap Tool:', hasProductRoadmapTool ? '✅ PRESENT' : '❌ MISSING')
    
    const hasAnalyticsDashboard = result.interface?.components?.some(c => 
      c.title?.toLowerCase().includes('analytics') || 
      c.description?.toLowerCase().includes('metrics'))
    console.log('📊 Analytics Dashboard:', hasAnalyticsDashboard ? '✅ PRESENT' : '❌ MISSING')
    
    const hasStakeholderSim = result.interface?.components?.some(c => 
      c.title?.toLowerCase().includes('stakeholder') || 
      c.description?.toLowerCase().includes('meeting'))
    console.log('👥 Stakeholder Simulation:', hasStakeholderSim ? '✅ PRESENT' : '❌ MISSING')
    
    const hasMarketResearch = result.interface?.components?.some(c => 
      c.title?.toLowerCase().includes('market') || 
      c.description?.toLowerCase().includes('research'))
    console.log('🔍 Market Research Tools:', hasMarketResearch ? '✅ PRESENT' : '❌ MISSING')
    
    const hasFinTechContext = JSON.stringify(result).toLowerCase().includes('fintech') || 
                             JSON.stringify(result).toLowerCase().includes('credit') ||
                             JSON.stringify(result).toLowerCase().includes('financial')
    console.log('💳 FinTech/Credit Context:', hasFinTechContext ? '✅ PRESENT' : '❌ MISSING')
    
  } catch (error) {
    console.log(`❌ Test failed: ${error.message}`)
    console.log('🔧 Make sure the development server is running: npm run dev')
  }
}

// Run the test
if (require.main === module) {
  testTomoAssessmentGeneration().catch(console.error)
}

module.exports = { testTomoAssessmentGeneration }
