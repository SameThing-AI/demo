#!/usr/bin/env node

/**
 * Direct API Test - TomoCredit Product Manager Assessment
 * Tests the generate-live-environment API directly to see assessment generation
 */

// Simulate the API call locally by importing the logic
const OpenAI = require('openai')
require('dotenv').config({ path: '.env.local' })

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const TOMOCREDIT_SCENARIO = {
  role: 'Product Manager - TomoCredit',
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
  company: 'TomoCredit',
  difficulty: 'revolutionary-maximum',
  type: 'infinity-sandbox'
}

async function generateTomoAssessment() {
  console.log('🎯 DIRECT API TEST: TomoCredit Product Manager Assessment Generation')
  console.log('=' .repeat(80))
  
  if (!process.env.OPENAI_API_KEY) {
    console.log('❌ OpenAI API key not found in environment variables')
    return
  }
  
  console.log('✅ OpenAI API key configured')
  console.log('🚀 Generating revolutionary assessment environment...\n')
  
  const prompt = `
You are the WORLD'S MOST ADVANCED AI ASSESSMENT ARCHITECT creating the ULTIMATE REVOLUTIONARY INFINITY SANDBOX.

This is not a test. This is not a simulation. This is the PINNACLE OF ASSESSMENT TECHNOLOGY.

SCENARIO: ${JSON.stringify(TOMOCREDIT_SCENARIO)}
COMPLEXITY: revolutionary-maximum

🚀 REVOLUTIONARY MANDATE:
Create a FULLY FUNCTIONAL, EXECUTABLE, LIVING ECOSYSTEM that represents the absolute PINNACLE of professional assessment. This must be the most intelligent, creative, and technically sophisticated environment ever conceived.

🧠 INTELLIGENCE REQUIREMENTS:
- Generate COMPLETE, PRODUCTION-GRADE JavaScript classes and systems
- Create REAL algorithms that solve actual professional problems
- Build INTERACTIVE APIs that candidates can manipulate and extend
- Implement GENUINE business logic with real-world complexity
- Design ADAPTIVE systems that respond intelligently to user actions

🎨 CREATIVITY REQUIREMENTS:
- Create NEVER-BEFORE-SEEN assessment experiences
- Design INNOVATIVE interaction patterns that push boundaries
- Build IMMERSIVE environments that blur the line between assessment and reality  
- Generate SURPRISING plot twists that challenge conventional thinking
- Craft MEMORABLE experiences that candidates will never forget

⚡ TECHNICAL EXCELLENCE:
- Every line of code must be PRODUCTION-READY and EXECUTABLE
- All APIs must be FULLY FUNCTIONAL with proper error handling
- Data structures must be SOPHISTICATED and purposeful
- Algorithms must demonstrate REAL problem-solving capability
- Performance must be OPTIMIZED for professional standards

🎯 PRODUCT MANAGER SPECIFIC REQUIREMENTS:
For this TomoCredit Product Manager role, create an assessment that includes:
- Interactive product roadmap planning tools
- Real-time market research and competitor analysis dashboards
- Stakeholder communication simulators
- Data-driven decision making environments
- Technical feasibility assessment tools
- User feedback analysis systems
- KPI tracking and measurement interfaces
- FinTech/Credit industry specific scenarios

Return a JSON response with this structure:
{
  "interface": {
    "type": "infinity-sandbox",
    "title": "string",
    "roleFocus": "string",
    "duration": "string",
    "features": {
      "interactive": true,
      "realTime": true,
      "collaborative": true,
      "dataVisualization": true,
      "codeExecution": true
    },
    "components": [
      {
        "type": "interactive-dashboard",
        "title": "string",
        "description": "string",
        "code": "complete executable JavaScript code",
        "challenges": [
          {
            "title": "string",
            "description": "string",
            "objectives": ["string"],
            "success_criteria": ["string"]
          }
        ]
      }
    ],
    "executionEnvironment": {
      "runtime": "browser",
      "features": {
        "dataProcessing": true,
        "visualization": true,
        "simulation": true
      }
    }
  },
  "scenarios": [
    {
      "title": "string",
      "description": "string",
      "type": "product-management",
      "difficulty": "revolutionary-maximum",
      "tasks": [
        {
          "title": "string",
          "description": "string",
          "deliverables": ["string"]
        }
      ]
    }
  ]
}

Make this the most sophisticated, innovative, and revolutionary Product Manager assessment ever created for a FinTech credit company like TomoCredit.`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are the world's most advanced AI assessment architect. Create revolutionary, executable, and immersive assessment environments. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    })

    const response = completion.choices[0]?.message?.content
    
    if (!response) {
      console.log('❌ No response from OpenAI')
      return
    }
    
    console.log('📝 Raw AI Response Length:', response.length)
    console.log('📋 First 200 characters:', response.substring(0, 200))
    
    // Parse the response
    let assessmentData
    try {
      let cleanResponse = response.trim()
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      assessmentData = JSON.parse(cleanResponse)
      console.log('✅ Successfully parsed assessment data\n')
      
    } catch (parseError) {
      console.log('❌ Failed to parse response:', parseError.message)
      console.log('Raw response:', response)
      return
    }
    
    // Display the generated assessment
    console.log('🎮 GENERATED ASSESSMENT ENVIRONMENT:')
    console.log('=' .repeat(50))
    
    if (assessmentData.interface) {
      const intf = assessmentData.interface
      console.log('🏷️  Title:', intf.title)
      console.log('🎯 Role Focus:', intf.roleFocus)
      console.log('⏱️  Duration:', intf.duration)
      console.log('🛠️  Features:', JSON.stringify(intf.features, null, 2))
      
      if (intf.components && intf.components.length > 0) {
        console.log('\n🧩 INTERACTIVE COMPONENTS:')
        intf.components.forEach((comp, i) => {
          console.log(`\n  ${i+1}. ${comp.type?.toUpperCase()} - ${comp.title}`)
          console.log(`     Description: ${comp.description}`)
          console.log(`     Code Length: ${comp.code?.length || 0} characters`)
          
          if (comp.code && comp.code.length > 0) {
            console.log(`     Code Preview:`)
            console.log(`     ${comp.code.substring(0, 150)}...`)
          }
          
          if (comp.challenges && comp.challenges.length > 0) {
            console.log(`     Challenges:`)
            comp.challenges.forEach((challenge, j) => {
              console.log(`       ${j+1}. ${challenge.title}`)
              console.log(`          ${challenge.description}`)
            })
          }
        })
      }
    }
    
    if (assessmentData.scenarios && assessmentData.scenarios.length > 0) {
      console.log('\n🎭 ASSESSMENT SCENARIOS:')
      assessmentData.scenarios.forEach((scenario, i) => {
        console.log(`\n  ${i+1}. ${scenario.title}`)
        console.log(`     Type: ${scenario.type}`)
        console.log(`     Description: ${scenario.description}`)
        
        if (scenario.tasks && scenario.tasks.length > 0) {
          console.log(`     Tasks:`)
          scenario.tasks.forEach((task, j) => {
            console.log(`       ${j+1}. ${task.title}`)
            console.log(`          ${task.description}`)
          })
        }
      })
    }
    
    // Analysis
    console.log('\n🏆 ASSESSMENT QUALITY ANALYSIS:')
    console.log('=' .repeat(40))
    
    const hasProductElements = JSON.stringify(assessmentData).toLowerCase().includes('product') ||
                              JSON.stringify(assessmentData).toLowerCase().includes('roadmap')
    console.log('📋 Product Management Focus:', hasProductElements ? '✅' : '❌')
    
    const hasFinTechElements = JSON.stringify(assessmentData).toLowerCase().includes('fintech') ||
                              JSON.stringify(assessmentData).toLowerCase().includes('credit') ||
                              JSON.stringify(assessmentData).toLowerCase().includes('financial')
    console.log('💳 FinTech/Credit Context:', hasFinTechElements ? '✅' : '❌')
    
    const hasInteractiveCode = assessmentData.interface?.components?.some(c => c.code && c.code.length > 100)
    console.log('💻 Executable Code Components:', hasInteractiveCode ? '✅' : '❌')
    
    const hasMultipleScenarios = assessmentData.scenarios && assessmentData.scenarios.length > 1
    console.log('🎭 Multiple Assessment Scenarios:', hasMultipleScenarios ? '✅' : '❌')
    
    const hasRevolutionaryFeatures = assessmentData.interface?.features?.interactive &&
                                   assessmentData.interface?.features?.realTime
    console.log('🚀 Revolutionary Interactive Features:', hasRevolutionaryFeatures ? '✅' : '❌')
    
    console.log('\n🎉 ASSESSMENT GENERATION COMPLETE!')
    
  } catch (error) {
    console.log('❌ API call failed:', error.message)
  }
}

// Run the test
if (require.main === module) {
  generateTomoAssessment().catch(console.error)
}

module.exports = { generateTomoAssessment }
