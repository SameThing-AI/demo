# 🤖 AI Chatbot Credits - Issue Resolution

## 🎯 **Issue Identified**

The user can see AI credits in their account but can't use the AI chatbot during assessments. This is because they were testing in **preview mode** where AI features are intentionally disabled.

## ✅ **Root Cause**

- **Preview Mode**: When recruiters click "Preview" on an assessment (`/recruiter/assessments/[id]/preview`), it sets `isPreview={true}`
- **AI Disabled**: The `TakeAssessment` component disables the AI chatbot when `isPreview` is true
- **This is intentional**: Preview mode is for recruiters to see how the assessment looks, not to test AI features

## 🔧 **Solution Applied**

### 1. **Enhanced Preview Mode Messaging**
- Added clear notice that AI chatbot is disabled in preview mode
- Shows candidates will see AI assistant with specific credit amounts

### 2. **Improved Credit Display**
- Better messaging about AI assistant availability
- Visual indicators when credits are/aren't available
- Enhanced chatbot button with pulsing animation when credits available

### 3. **Better User Feedback**
- Clear explanations when no credits are available
- Different messages for preview vs actual assessment mode

## 🧪 **How to Test AI Chatbot Properly**

### ❌ **Wrong Way (Preview Mode)**
```
1. Go to /recruiter/assessments/[id]
2. Click "Preview" button
3. Take assessment → AI chatbot won't appear (this is correct!)
```

### ✅ **Right Way (Candidate Mode)**
```
1. Login as a CANDIDATE account (or create one)
2. Go to /candidate 
3. Take an assigned assessment → AI chatbot will appear
OR
4. Access assessment via direct link/assignment → AI chatbot works
```

### 🔄 **Alternative Testing (Developer)**
```
1. Go to TakeAssessment component usage
2. Temporarily remove `isPreview={true}` or set it to `false`
3. Test the assessment → AI chatbot will appear
```

## 📋 **What You Should See in Candidate Mode**

### **Question Display**
- Question header shows: "3 AI Credits" (or 2/4 based on difficulty)
- Helper text: "AI Assistant Available: Look for the blue chatbot button..."

### **Chatbot Button**
- Blue floating button in bottom-right corner
- Shows credit count (e.g., "3")
- Pulses when credits are available
- Gray when no credits

### **Chatbot Functionality**
- Click button to open chat interface
- Initial message explains credit system
- Credits decrease by 1 after each AI response
- Input disabled when credits reach 0

## 🎯 **Credit Assignment Logic**

```typescript
// Based on question difficulty in TakeAssessment.tsx
const difficulty = question.difficulty?.toLowerCase() || 'medium'
const credits = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4

// Easy questions: 2 credits
// Medium questions: 3 credits  
// Hard questions: 4 credits
```

## 🔍 **Debug Checklist**

If AI chatbot still not appearing in candidate mode:

1. **Check Browser Console** for JavaScript errors
2. **Verify Question Structure** - ensure questions have `difficulty` field
3. **Check Network Tab** - look for calls to `/api/assessment-chatbot`
4. **Verify User Role** - must be logged in as candidate
5. **Confirm Not Preview Mode** - check URL doesn't contain `/preview`

## 📝 **Files Modified**

- `app/recruiter/assessments/[id]/preview/page.tsx` - Added preview mode notice
- `components/TakeAssessment.tsx` - Enhanced credit messaging
- `components/AssessmentChatbot.tsx` - Improved visibility and feedback

## 🚀 **Next Steps**

1. **Test as candidate** using the correct method above
2. **Verify credits work** and decrease properly
3. **Check all question difficulties** have appropriate credits
4. **Confirm API responses** are working correctly

The AI chatbot should now work perfectly in candidate mode with clear credit display and proper functionality!
