# AI Assessment Chatbot Feature

## Overview

The AI Assessment Chatbot is an innovative feature that provides candidates with AI-powered assistance during assessments while maintaining the integrity of the evaluation process. This feature simulates real-world problem-solving scenarios where AI assistance is available but needs to be used strategically.

## Key Features

### 🤖 Intelligent AI Assistant
- **Context-Aware**: The chatbot understands the job role, job description, and specific assessment question
- **Guided Learning**: Provides hints and guidance without giving direct answers
- **Strategic Usage**: Limited credits encourage thoughtful and strategic use of AI assistance

### ⚡ Credit System
- **Dynamic Credits**: Each question receives credits based on difficulty level:
  - **Easy Questions**: 2 credits
  - **Medium Questions**: 3 credits  
  - **Hard Questions**: 4 credits
- **Real-time Tracking**: Credits are tracked and displayed for each question
- **Strategic Decision Making**: Candidates must decide when and how to use their limited AI assistance

### 🎯 Smart Guidance
- **No Direct Answers**: The AI assistant provides guidance, hints, and methodology help
- **Problem-Solving Focus**: Encourages candidates to think through problems systematically
- **Educational Approach**: Helps candidates understand concepts rather than providing solutions

## How It Works

### For Candidates

1. **Question Display**: Each question shows the number of AI credits available
2. **AI Assistant Access**: Click the floating AI Assistant button (bottom right)
3. **Strategic Conversation**: Use credits to ask for guidance, hints, or problem-solving approaches
4. **Real-time Feedback**: See remaining credits and conversation history
5. **Independent Completion**: Complete the assessment using both AI guidance and personal knowledge

### For Recruiters

1. **Automatic Integration**: AI chatbot is automatically available for all assessments
2. **Fair Evaluation**: Candidates are evaluated on their problem-solving approach and final answers
3. **Modern Assessment**: Reflects real-world scenarios where AI tools are commonly used
4. **Skill Assessment**: Tests strategic thinking and effective use of available resources

## Technical Implementation

### API Endpoint
- **Route**: `/api/assessment-chatbot`
- **Method**: POST
- **Authentication**: Required (candidate session)
- **Rate Limiting**: Credit-based system prevents abuse

### AI Integration
- **Model**: GPT-4 for intelligent responses
- **Context Awareness**: Includes job role, description, and question details
- **Response Guidelines**: Structured prompts ensure appropriate guidance level
- **Fallback System**: Graceful degradation when AI service is unavailable

### UI Components
- **AssessmentChatbot**: Main chatbot interface component
- **TakeAssessment**: Updated to include credit system and chatbot integration
- **Credit Display**: Real-time credit tracking and visual indicators

## Usage Examples

### Example Interaction 1: Seeking Approach Guidance
**Candidate**: "I'm not sure how to approach this algorithm problem. Where should I start?"

**AI Assistant**: "Let's break this down step by step. What do you understand about the problem so far? What's the first thing that comes to mind when you read the requirements? Think about the input and expected output - what transformation needs to happen?"

### Example Interaction 2: Technical Concept Clarification
**Candidate**: "What design pattern would work best here?"

**AI Assistant**: "Instead of me telling you which pattern, let's think about the problem characteristics. What behaviors need to change at runtime? What relationships exist between the objects? Consider the principles of loose coupling and high cohesion - what does that suggest for your design approach?"

### Example Interaction 3: Debugging Approach
**Candidate**: "My solution isn't working correctly. How can I debug this?"

**AI Assistant**: "Great question! Debugging systematically is a key skill. What output are you getting versus what you expect? Can you trace through your logic with a simple example? What assumptions did you make that might need verification?"

## Benefits

### For Candidates
- **Realistic Assessment**: Mirrors modern work environments where AI assistance is common
- **Reduced Anxiety**: Provides support while maintaining assessment integrity
- **Skill Development**: Learns effective AI collaboration strategies
- **Fair Evaluation**: Shows problem-solving approach, not just final answers

### For Recruiters  
- **Modern Evaluation**: Assesses candidates' ability to work with AI tools effectively
- **Better Insights**: Reveals problem-solving methodology and strategic thinking
- **Real-world Skills**: Tests skills actually needed in today's work environment
- **Candidate Experience**: Improved assessment experience leads to better candidate engagement

## Configuration

### Environment Variables
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### Credit Configuration
Credits are automatically assigned based on question difficulty, but can be customized in the `TakeAssessment` component:

```typescript
const difficulty = question.difficulty?.toLowerCase() || 'medium'
const credits = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4
```

### AI Behavior Customization
The AI assistant's behavior can be customized in the `/api/assessment-chatbot` endpoint by modifying the system prompt and response guidelines.

## Security & Privacy

- **Authentication Required**: Only authenticated candidates can access the chatbot
- **Session-based**: Conversations are tied to assessment sessions
- **No Answer Storage**: Direct answers are not provided or stored
- **Credit Limits**: Built-in abuse prevention through credit system
- **Context Isolation**: Each question's chatbot conversation is independent

## Future Enhancements

- **Multi-language Support**: Support for assessments in different languages
- **Custom Credit Rules**: Allow recruiters to configure credit allocation
- **Usage Analytics**: Detailed insights into how candidates use AI assistance
- **Advanced AI Models**: Integration with specialized domain models
- **Voice Interface**: Voice-based AI assistance for accessibility

## Monitoring & Analytics

- **Usage Tracking**: Monitor how candidates use AI credits across questions
- **Performance Correlation**: Analyze relationship between AI usage and assessment scores
- **Question Difficulty Calibration**: Adjust credit allocation based on actual usage patterns
- **Candidate Feedback**: Collect feedback on AI assistant effectiveness

This feature represents a significant advancement in assessment technology, providing a more realistic and engaging evaluation experience while maintaining the integrity and fairness of the assessment process.
