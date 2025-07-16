const fetch = require('node-fetch');

async function testGenerateAssessment() {
  console.log('🧪 Testing Assessment Generation API...\n');
  
  const testData = {
    jobTitle: "Senior React Developer",
    company: "Tech Startup Inc",
    jobDescription: "We are looking for a Senior React Developer to join our fast-growing startup. You will be responsible for building modern web applications using React, TypeScript, and Node.js. Experience with AWS, GraphQL, and microservices architecture is preferred. We value clean code, testing, and agile development practices."
  };

  try {
    const response = await fetch('http://localhost:3000/api/generate-assessment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    console.log('✅ Assessment Generation Response:');
    console.log('Status:', response.status);
    console.log('Questions generated:', result.questions?.length || 0);
    
    if (result.questions && result.questions.length > 0) {
      console.log('\n📝 Sample Question:');
      console.log('Type:', result.questions[0].type);
      console.log('Difficulty:', result.questions[0].difficulty);
      console.log('Category:', result.questions[0].category);
      console.log('Question:', result.questions[0].question.substring(0, 100) + '...');
      
      // Check if this looks like AI-generated or fallback
      const isGeneric = result.questions[0].question.includes('synchronous and asynchronous programming');
      console.log('🤖 AI Generated:', !isGeneric ? '✅ YES' : '❌ NO (fallback used)');
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error testing assessment generation:', error.message);
    return null;
  }
}

async function testEvaluateAssessment(assessmentData) {
  if (!assessmentData) {
    console.log('⏭️  Skipping evaluation test - no assessment data');
    return;
  }

  console.log('\n🧪 Testing Assessment Evaluation API...\n');
  
  const testAnswers = {
    0: "Synchronous programming blocks execution until operations complete, while asynchronous programming allows other operations to continue. Examples: sync - file reading, async - API calls with promises.",
    1: "I would use a HashMap for O(1) access with LRU eviction policy. Implementation would include a doubly-linked list to track usage order and a hash map for fast lookups.",
    2: "First, analyze the query execution plan using EXPLAIN. Check for missing indexes, inefficient joins, or table scans. Add appropriate indexes, optimize WHERE clauses, and consider query restructuring."
  };

  const testData = {
    assessmentData: assessmentData,
    answers: testAnswers,
    candidateProfile: {
      name: "Test Candidate",
      experience: "5 years",
      skills: ["React", "TypeScript", "Node.js"]
    },
    timeSpent: 3600 // 1 hour in seconds
  };

  try {
    const response = await fetch('http://localhost:3000/api/evaluate-assessment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    console.log('✅ Assessment Evaluation Response:');
    console.log('Status:', response.status);
    console.log('Total Score:', result.totalScore + '/' + result.maxScore, '(' + result.percentage + '%)');
    console.log('Grade:', result.grade);
    console.log('Evaluated by:', result.evaluatedBy);
    
    // Check if this is AI evaluation or fallback
    const isAI = result.evaluatedBy?.includes('GPT') || !result.evaluatedBy?.includes('Fallback');
    console.log('🤖 AI Evaluated:', isAI ? '✅ YES' : '❌ NO (fallback used)');
    
    if (result.overallFeedback?.summary) {
      console.log('\n📄 Feedback Summary:');
      console.log(result.overallFeedback.summary.substring(0, 150) + '...');
    }
    
  } catch (error) {
    console.error('❌ Error testing assessment evaluation:', error.message);
  }
}

async function testChatbotAPI() {
  console.log('\n🧪 Testing Assessment Chatbot API...\n');
  
  const testData = {
    message: "I'm confused about the difference between synchronous and asynchronous programming. Can you help guide me?",
    question: "Explain the differences between synchronous and asynchronous programming. Provide examples of when you would use each approach.",
    jobRole: "Senior React Developer",
    jobDescription: "Building modern web applications using React, TypeScript, and Node.js",
    questionDifficulty: "Medium",
    conversationHistory: []
  };

  try {
    const response = await fetch('http://localhost:3000/api/assessment-chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    console.log('✅ Chatbot API Response:');
    console.log('Status:', response.status);
    
    if (response.status === 200) {
      console.log('Response length:', result.response?.length || 0, 'characters');
      console.log('Remaining credits:', result.remainingCredits);
      
      if (result.response) {
        console.log('\n🤖 Chatbot Response Preview:');
        console.log(result.response.substring(0, 200) + '...');
        
        // Check if response looks like AI guidance
        const hasGuidance = result.response.includes('think about') || result.response.includes('consider') || result.response.includes('approach');
        console.log('📚 Contains Guidance:', hasGuidance ? '✅ YES' : '❌ NO');
      }
    } else {
      console.log('❌ Error:', result.error || 'Unknown error');
    }
    
  } catch (error) {
    console.error('❌ Error testing chatbot API:', error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Starting AI API Tests...\n');
  
  // Test assessment generation
  const assessmentData = await testGenerateAssessment();
  
  // Test assessment evaluation
  await testEvaluateAssessment(assessmentData);
  
  // Test chatbot
  await testChatbotAPI();
  
  console.log('\n✅ All tests completed!');
}

// Run tests
runAllTests().catch(console.error);
