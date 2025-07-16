const fetch = require('node-fetch');

async function inspectAssessmentStructure() {
  console.log('🔍 Inspecting Assessment Structure...\n');
  
  const testData = {
    jobTitle: "Senior React Developer",
    company: "Tech Startup Inc",
    jobDescription: "We are looking for a Senior React Developer to join our fast-growing startup."
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
    
    console.log('📊 Full Assessment Structure:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.questions && result.questions.length > 0) {
      console.log('\n🎯 Analyzing each question:');
      result.questions.forEach((question, index) => {
        console.log(`\nQuestion ${index + 1}:`);
        console.log('  Type:', question.type);
        console.log('  Difficulty:', question.difficulty);
        console.log('  Category:', question.category);
        console.log('  Has difficulty property:', question.hasOwnProperty('difficulty'));
        console.log('  Difficulty value type:', typeof question.difficulty);
        console.log('  Difficulty lowercase:', question.difficulty?.toLowerCase());
        
        // Calculate credits as the UI does
        const difficulty = question.difficulty?.toLowerCase() || 'medium';
        const credits = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
        console.log('  Calculated credits:', credits);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

inspectAssessmentStructure().catch(console.error);
