#!/usr/bin/env node

/**
 * AI Chatbot Credits Debug Script
 * Tests the AI chatbot credit system and display
 */

const fs = require('fs');
const path = require('path');

console.log('🤖 AI Chatbot Credits Debug\n');

// Check 1: Verify AssessmentChatbot component structure
console.log('✅ AssessmentChatbot Component Analysis');
const chatbotPath = path.join(__dirname, 'components/AssessmentChatbot.tsx');
const chatbotContent = fs.readFileSync(chatbotPath, 'utf8');

const chatbotFeatures = [
  { name: 'Credits state management', pattern: 'useState.*credits' },
  { name: 'MaxCredits prop', pattern: 'maxCredits.*number' },
  { name: 'Credits display in button', pattern: 'credits.*}' },
  { name: 'Credits display in header', pattern: 'Zap.*credits' },
  { name: 'Initial message with credits', pattern: 'maxCredits.*credits.*use' },
  { name: 'Credit deduction logic', pattern: 'credits.*-.*1' },
  { name: 'Credit validation before send', pattern: 'credits.*<=.*0' }
];

chatbotFeatures.forEach(feature => {
  if (chatbotContent.match(new RegExp(feature.pattern, 'i'))) {
    console.log(`✓ ${feature.name}`);
  } else {
    console.log(`✗ ${feature.name} - NOT FOUND`);
  }
});

console.log('\n');

// Check 2: Verify TakeAssessment credit initialization
console.log('✅ TakeAssessment Credit Initialization');
const takeAssessmentPath = path.join(__dirname, 'components/TakeAssessment.tsx');
const takeAssessmentContent = fs.readFileSync(takeAssessmentPath, 'utf8');

const creditFeatures = [
  { name: 'QuestionCredits state', pattern: 'questionCredits.*useState' },
  { name: 'Credit initialization useEffect', pattern: 'useEffect.*questions.*credits' },
  { name: 'Difficulty-based credit assignment', pattern: 'difficulty.*easy.*2.*medium.*3.*4' },
  { name: 'Credit display in UI', pattern: 'AI Credits.*questionCredits' },
  { name: 'AssessmentChatbot maxCredits prop', pattern: 'maxCredits.*questionCredits' },
  { name: 'Credit update handler', pattern: 'handleCreditsChange' }
];

creditFeatures.forEach(feature => {
  if (takeAssessmentContent.match(new RegExp(feature.pattern, 'i'))) {
    console.log(`✓ ${feature.name}`);
  } else {
    console.log(`✗ ${feature.name} - NOT FOUND`);
  }
});

console.log('\n');

// Check 3: Sample assessment question structure
console.log('✅ Sample Assessment Question Structure');
const sampleAssessmentsPath = path.join(__dirname, 'sample-assessments.json');
const sampleContent = fs.readFileSync(sampleAssessmentsPath, 'utf8');
const sampleData = JSON.parse(sampleContent);

if (sampleData.sampleAssessments && sampleData.sampleAssessments[0]?.questions) {
  const firstAssessment = sampleData.sampleAssessments[0];
  console.log(`Assessment: ${firstAssessment.jobTitle}`);
  console.log(`Questions count: ${firstAssessment.questions.length}`);
  
  firstAssessment.questions.forEach((q, index) => {
    const difficulty = q.difficulty || 'Unknown';
    const credits = difficulty.toLowerCase() === 'easy' ? 2 : 
                   difficulty.toLowerCase() === 'medium' ? 3 : 4;
    console.log(`  Q${index + 1}: ${difficulty} difficulty → ${credits} AI credits`);
  });
} else {
  console.log('✗ No sample questions found');
}

console.log('\n');

// Check 4: API endpoint functionality
console.log('✅ API Endpoint Analysis');
const apiPath = path.join(__dirname, 'app/api/assessment-chatbot/route.ts');
const apiContent = fs.readFileSync(apiPath, 'utf8');

const apiFeatures = [
  { name: 'POST handler', pattern: 'export async function POST' },
  { name: 'OpenAI integration', pattern: 'openai.*chat' },
  { name: 'Fallback for missing API key', pattern: 'OPENAI_API_KEY.*not available' },
  { name: 'System prompt with guidelines', pattern: 'Do NOT provide direct answers' },
  { name: 'Response structure', pattern: 'response.*remainingCredits' }
];

apiFeatures.forEach(feature => {
  if (apiContent.match(new RegExp(feature.pattern, 'i'))) {
    console.log(`✓ ${feature.name}`);
  } else {
    console.log(`✗ ${feature.name} - NOT FOUND`);
  }
});

console.log('\n');

// Debug suggestions
console.log('🔍 Troubleshooting Suggestions:\n');
console.log('1. **Check Browser Console**: Look for any JavaScript errors');
console.log('2. **Verify Question Structure**: Ensure assessment questions have difficulty field');
console.log('3. **Test Credit Display**: Check if credits show in the question header');
console.log('4. **Look for Chatbot Button**: Should appear as floating blue button (bottom-right)');
console.log('5. **Test in Non-Preview Mode**: AI assistant only works in actual assessments');
console.log('6. **Check Network Tab**: Verify API calls to /api/assessment-chatbot');
console.log('\n');

console.log('🎯 Expected Behavior:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ Question header shows "X AI Credits" badge');
console.log('✅ Blue floating button appears in bottom-right with credit count');
console.log('✅ Clicking button opens chatbot with initial message mentioning credits');
console.log('✅ Credits decrease by 1 after each successful AI response');
console.log('✅ Send button disabled when credits reach 0');
console.log('✅ Different questions have different credit amounts based on difficulty');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
