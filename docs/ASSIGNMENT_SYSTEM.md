# Assessment Assignment System

## Overview
The assessment assignment system allows recruiters to assign assessments to specific candidates, creating a more structured hiring process. This feature ensures that candidates receive specific assessments from recruiters and can track their assigned tasks.

## How It Works

### For Recruiters

1. **Create an Assessment**
   - Navigate to `/recruiter/assessments/create`
   - Create a new assessment (Traditional or AI-Powered)

2. **Assign Assessment to Candidates**
   - Go to the assessment detail page (`/recruiter/assessments/[id]`)
   - Click the "Assign to Candidates" button
   - Select candidates from the registered users
   - Set a due date for the assessment
   - Click "Assign Assessment"

3. **Track Assignments**
   - View assignment statistics on the assessment detail page
   - See who has been assigned the assessment
   - Track assignment status (assigned, started, completed, expired)

### For Candidates

1. **View Assigned Assessments**
   - Log in to the candidate dashboard (`/candidate`)
   - See all assigned assessments in the "Assigned Assessments" section
   - View due dates, assignment status, and recruiter information

2. **Take Assigned Assessments**
   - Click "Start" or "Continue" on an assigned assessment
   - Complete the assessment as normal
   - Assessment status automatically updates to "completed"

3. **Track Progress**
   - Monitor assignment status (assigned, started, completed, overdue)
   - See time remaining until due date
   - Get alerts for overdue assessments

## Database Schema

### AssessmentAssignment Collection
```javascript
{
  assessmentId: ObjectId,      // Reference to Assessment
  candidateId: ObjectId,       // Reference to User (candidate)
  assignedBy: ObjectId,        // Reference to User (recruiter)
  status: String,              // 'assigned', 'started', 'completed', 'expired'
  dueDate: Date,              // When the assessment is due
  assignedAt: Date,           // When the assignment was created
  startedAt: Date,            // When candidate started the assessment
  completedAt: Date,          // When candidate completed the assessment
  isActive: Boolean           // Whether the assignment is active
}
```

## API Endpoints

### Assignment Management
- `POST /api/assessments/assign` - Assign assessment to candidates
- `GET /api/assessments/assign?assessmentId=<id>` - Get assignments for an assessment
- `GET /api/assignments` - Get assigned assessments for a candidate
- `PATCH /api/assignments` - Update assignment status

### Candidate Management
- `GET /api/candidates` - Get list of registered candidates (for recruiters)

## Features

### Assignment Status Tracking
- **Assigned**: Assessment has been assigned but not started
- **Started**: Candidate has begun the assessment
- **Completed**: Assessment has been finished
- **Expired**: Assessment is past due date

### Due Date Management
- Visual indicators for approaching due dates
- Overdue warnings and alerts
- Automatic status updates

### Security & Permissions
- Only recruiters can assign assessments
- Only candidates can view their assigned assessments
- Assessments can only be assigned to users with 'candidate' role
- Recruiters can only assign their own assessments

## Usage Example

1. Recruiter creates an assessment
2. Recruiter assigns it to 5 candidates with a due date of next Friday
3. Candidates receive the assignment and can see it in their dashboard
4. As candidates complete assessments, status updates automatically
5. Recruiter can track progress and see completion rates

This system ensures a structured, trackable assessment process for hiring workflows.
