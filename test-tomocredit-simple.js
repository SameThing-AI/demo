#!/usr/bin/env node

/**
 * Simple TomoCredit Assessment Test
 * Tests what the revolutionary platform generates for Product Manager role
 */

// Read environment variables manually
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

async function testTomoCreditAssessment() {
  console.log('🎯 TOMOCREDIT PRODUCT MANAGER ASSESSMENT TEST')
  console.log('=' .repeat(60))
  
  const apiKey = loadEnvFile()
  
  if (!apiKey || apiKey === 'your-openai-api-key-here') {
    console.log('❌ OpenAI API key not properly configured')
    return
  }
  
  console.log('✅ OpenAI API key found:', apiKey.substring(0, 10) + '...')
  console.log('🚀 Sending request to generate TomoCredit assessment...\n')
  
  const testPayload = {
    scenario: {
      role: 'Product Manager - TomoCredit',
      company: 'TomoCredit',
      description: `TomoCredit Product Manager - FinTech credit system革新者. Key responsibilities include product vision, roadmap development, stakeholder management, data-driven decisions, user research, technical collaboration with engineering teams. Must have 3-5+ years PM experience, technical background, launched products, Agile expertise, analytics skills. Focus on replacing outdated credit system, opening banking access, working with Inc.'s top female founders in fastest-growing FinTech area.`,
      difficulty: 'revolutionary-maximum',
      type: 'infinity-sandbox',
      requirements: [
        'Product roadmap planning and prioritization',
        'Stakeholder communication and management', 
        'Data-driven decision making with analytics',
        'User research and feedback analysis',
        'Technical collaboration with engineering',
        'FinTech and credit industry knowledge',
        'Market research and competitive analysis',
        'KPI tracking and performance measurement'
      ]
    },
    type: 'infinity-sandbox',
    complexity: 'revolutionary-maximum'
  }
  
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
            content: 'You are the world\'s most advanced AI assessment architect. Create revolutionary, executable, interactive assessment environments for professional roles. Always respond with valid JSON only.'
          },
          {
            role: 'user', 
            content: `Create a REVOLUTIONARY INFINITY SANDBOX assessment for: ${JSON.stringify(testPayload.scenario)}
            
This must be a FULLY INTERACTIVE, EXECUTABLE environment with:
- Real JavaScript code that candidates can run and modify
- Interactive dashboards for product management tasks
- Data visualization and analytics tools
- Stakeholder simulation environments
- FinTech/credit industry specific scenarios
- Real-time feedback and adaptation

Return JSON with this structure:
{
  "interface": {
    "type": "infinity-sandbox",
    "title": "Assessment Title",
    "roleFocus": "Product Manager - FinTech",
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
      "type": "product-management",
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
    
    console.log('📝 AI Response Length:', aiResponse.length)
    console.log('📋 Response Preview:', aiResponse.substring(0, 200) + '...\n')
    
    // Parse the response
    let assessmentData
    try {
      let cleanResponse = aiResponse.trim()
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      assessmentData = JSON.parse(cleanResponse)
      console.log('✅ Successfully parsed assessment data')
      
    } catch (parseError) {
      console.log('❌ Failed to parse JSON response:', parseError.message)
      console.log('Raw response:', aiResponse)
      return
    }
    
    // Display the assessment details
    console.log('\n🎮 GENERATED ASSESSMENT ENVIRONMENT:')
    console.log('=' .repeat(50))
    
    if (assessmentData.interface) {
      const intf = assessmentData.interface
      console.log(`🏷️  Title: ${intf.title}`)
      console.log(`🎯 Role Focus: ${intf.roleFocus}`)
      console.log(`⏱️  Duration: ${intf.duration}`)
      console.log(`🛠️  Type: ${intf.type}`)
      
      console.log('\n🔧 FEATURES:')
      if (intf.features) {
        Object.entries(intf.features).forEach(([key, value]) => {
          console.log(`  • ${key}: ${value}`)
        })
      }
      
      if (intf.components && intf.components.length > 0) {
        console.log('\n🧩 INTERACTIVE COMPONENTS:')
        intf.components.forEach((comp, i) => {
          console.log(`\n  ${i+1}. ${comp.type?.toUpperCase()} - "${comp.title}"`)
          console.log(`     📝 Description: ${comp.description}`)
          
          if (comp.code) {
            console.log(`     💻 Code Length: ${comp.code.length} characters`)
            console.log(`     📋 Code Preview:`)
            const codeLines = comp.code.split('\n').slice(0, 5)
            codeLines.forEach(line => console.log(`        ${line}`))
            if (comp.code.split('\n').length > 5) {
              console.log(`        ... (${comp.code.split('\n').length - 5} more lines)`)
            }
          }
          
          if (comp.challenges && comp.challenges.length > 0) {
            console.log(`     🎯 Challenges (${comp.challenges.length}):`)
            comp.challenges.forEach((challenge, j) => {
              console.log(`       ${j+1}. ${challenge.title}`)
              console.log(`          ${challenge.description}`)
              if (challenge.objectives && challenge.objectives.length > 0) {
                console.log(`          Objectives: ${challenge.objectives.join(', ')}`)
              }
            })
          }
        })
      }
    }
    
    if (assessmentData.scenarios && assessmentData.scenarios.length > 0) {
      console.log('\n🎭 ASSESSMENT SCENARIOS:')
      assessmentData.scenarios.forEach((scenario, i) => {
        console.log(`\n  ${i+1}. "${scenario.title}"`)
        console.log(`     📝 Description: ${scenario.description}`)
        console.log(`     🏷️  Type: ${scenario.type}`)
        console.log(`     ⚡ Difficulty: ${scenario.difficulty}`)
        
        if (scenario.tasks && scenario.tasks.length > 0) {
          console.log(`     📋 Tasks (${scenario.tasks.length}):`)
          scenario.tasks.forEach((task, j) => {
            console.log(`       ${j+1}. ${task.title}`)
            console.log(`          ${task.description}`)
            if (task.deliverables && task.deliverables.length > 0) {
              console.log(`          Deliverables: ${task.deliverables.join(', ')}`)
            }
          })
        }
      })
    }
    
    // Quality analysis
    console.log('\n🏆 ASSESSMENT QUALITY ANALYSIS:')
    console.log('=' .repeat(40))
    
    const fullText = JSON.stringify(assessmentData).toLowerCase()
    
    console.log('📊 Revolutionary Features Analysis:')
    console.log(`  • Interactive Elements: ${assessmentData.interface?.features?.interactive ? '✅' : '❌'}`)
    console.log(`  • Real-time Capability: ${assessmentData.interface?.features?.realTime ? '✅' : '❌'}`)
    console.log(`  • Code Execution: ${assessmentData.interface?.features?.codeExecution ? '✅' : '❌'}`)
    console.log(`  • Data Visualization: ${assessmentData.interface?.features?.dataVisualization ? '✅' : '❌'}`)
    
    console.log('\n🎯 Product Manager Specific Elements:')
    console.log(`  • Product/Roadmap Focus: ${fullText.includes('product') || fullText.includes('roadmap') ? '✅' : '❌'}`)
    console.log(`  • Stakeholder Management: ${fullText.includes('stakeholder') ? '✅' : '❌'}`)
    console.log(`  • Analytics/Data Focus: ${fullText.includes('analytics') || fullText.includes('data') ? '✅' : '❌'}`)
    console.log(`  • User Research Elements: ${fullText.includes('user') || fullText.includes('research') ? '✅' : '❌'}`)
    
    console.log('\n💳 FinTech/TomoCredit Context:')
    console.log(`  • FinTech Industry Focus: ${fullText.includes('fintech') || fullText.includes('financial') ? '✅' : '❌'}`)
    console.log(`  • Credit System Elements: ${fullText.includes('credit') || fullText.includes('lending') ? '✅' : '❌'}`)
    console.log(`  • Banking/Finance Context: ${fullText.includes('bank') || fullText.includes('finance') ? '✅' : '❌'}`)
    
    console.log('\n💻 Technical Implementation:')
    const hasExecutableCode = assessmentData.interface?.components?.some(c => c.code && c.code.length > 50)
    const hasMultipleComponents = assessmentData.interface?.components?.length > 1
    const hasDetailedChallenges = assessmentData.interface?.components?.some(c => c.challenges && c.challenges.length > 0)
    
    console.log(`  • Executable Code Components: ${hasExecutableCode ? '✅' : '❌'}`)
    console.log(`  • Multiple Interactive Components: ${hasMultipleComponents ? '✅' : '❌'}`)
    console.log(`  • Detailed Challenge Structure: ${hasDetailedChallenges ? '✅' : '❌'}`)
    
    console.log('\n🎉 ASSESSMENT GENERATION COMPLETE!')
    console.log('This assessment environment would be loaded in the LiveSimulationEngine')
    console.log('for candidates taking a revolutionary TomoCredit Product Manager assessment.')
    
  } catch (error) {
    console.log('❌ Test failed:', error.message)
  }
}

// Run the test
if (require.main === module) {
  testTomoCreditAssessment().catch(console.error)
}

module.exports = { testTomoCreditAssessment }
