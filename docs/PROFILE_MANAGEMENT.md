# User Profile Management System

## Overview

The AI-powered hiring assessment platform now includes a comprehensive user profile management system that allows candidates to maintain detailed profiles and supports LinkedIn import functionality (with provisions for future implementation).

## Features

### 1. Enhanced User Model

The User model has been extended with a comprehensive profile schema:

```typescript
profile: {
  firstName: String,
  lastName: String,
  phone: String,
  location: String,
  summary: String,
  experience: String,
  skills: [String],
  education: String,
  linkedinUrl: String,
  githubUrl: String,
  portfolioUrl: String,
  preferredRoles: [String],
  salaryExpectation: String,
  availability: String,
  workAuthorization: String,
  languages: [String],
  certifications: [String],
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    url: String,
    startDate: Date,
    endDate: Date,
  }],
  workExperience: [{
    company: String,
    position: String,
    description: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
  }],
  profileCompletion: Number (0-100),
  lastUpdated: Date,
}
```

### 2. Profile Completion Tracking

The system automatically calculates profile completion percentage based on:

**Required Fields (80% weight):**
- firstName
- lastName
- phone
- location
- summary
- experience
- skills
- education

**Optional Fields (20% weight):**
- linkedinUrl
- githubUrl
- portfolioUrl
- resume
- preferredRoles
- workExperience
- projects

### 3. Enhanced Profile API

**GET /api/user/profile**
- Returns complete user profile including profile completion percentage

**PUT /api/user/profile**
- Updates profile data with merge capability
- Automatically recalculates profile completion
- Validates and sanitizes input data

**PATCH /api/user/profile**
- Updates basic user information (name, role, company)
- Maintains backward compatibility

### 4. LinkedIn Import System

**POST /api/user/linkedin-import**

The LinkedIn import system is designed with future extensibility in mind:

#### Current Implementation
- Validates LinkedIn URL format
- Provides user-friendly messaging about manual entry requirements
- Structured to easily integrate with LinkedIn API when available

#### Future Implementation Ready
The system is prepared for LinkedIn API integration requiring:

1. **LinkedIn Developer App Setup:**
   - Create app at https://www.linkedin.com/developers/
   - Configure OAuth redirect URLs
   - Obtain client credentials

2. **Required Permissions:**
   - `r_liteprofile` - Basic profile information
   - `r_emailaddress` - Email address
   - `w_member_social` - (if needed for additional features)

3. **API Integration Points:**
   - Basic Profile: `https://api.linkedin.com/v2/me`
   - Profile Picture: `https://api.linkedin.com/v2/me?projection=(id,profilePicture(displayImage~digitalmediaAsset:playableStreams))`
   - Positions: `https://api.linkedin.com/v2/positions` (requires additional permissions)

### 5. AI Assessment Integration

The assessment evaluation system now includes candidate profile context:

```typescript
// Profile data is automatically included in evaluation requests
const evaluationRequest = {
  assessmentData: assessment,
  answers: candidateAnswers,
  candidateProfile: {
    name: user.name,
    email: user.email,
    experience: profile.experience,
    skills: profile.skills,
    education: profile.education,
    summary: profile.summary,
    // ... other profile fields
  },
  timeSpent: assessmentTime
}
```

This enables more accurate, context-aware AI evaluations that consider:
- Candidate's experience level
- Relevant skills
- Educational background
- Professional summary
- Job requirements alignment

### 6. User Interface

The profile management interface includes:

#### Basic Information Tab
- Name, email, role, company
- Account type selection
- Basic contact information

#### Personal Details Tab (Candidates Only)
- Contact information
- Social/professional links
- LinkedIn import functionality
- Professional summary

#### Professional Tab (Candidates Only)
- Experience level selection
- Skills management (comma-separated input)
- Education details
- Work authorization status
- Salary expectations
- Availability

#### Security Tab
- Password change functionality
- Account information display
- Security settings

### 7. Profile Completion Indicator

For candidates, the system displays:
- Real-time profile completion percentage
- Visual progress bar
- Encouragement to complete profile for better assessment accuracy

## Implementation Notes

### Security Considerations
- All profile data is validated on the server side
- Profile updates require authentication
- Sensitive information (passwords) are handled separately
- Rate limiting applied to profile update endpoints

### Data Migration
The system gracefully handles users without existing profile data:
- Default empty profile structure is created
- Existing users can gradually build their profiles
- No data loss occurs during profile enhancement

### API Compatibility
- Maintains backward compatibility with existing profile endpoints
- New endpoints use proper HTTP methods (PUT for full updates, PATCH for partial)
- Consistent error handling and response formats

## Future Enhancements

### Planned Features
1. **LinkedIn API Integration**
   - Full OAuth flow implementation
   - Automatic profile data import
   - Profile synchronization options

2. **Resume Upload and Parsing**
   - File upload functionality
   - AI-powered resume parsing
   - Automatic profile field population

3. **Profile Recommendations**
   - AI-powered profile completion suggestions
   - Industry-specific profile optimization
   - Skills gap analysis

4. **Advanced Profile Features**
   - Portfolio project management
   - Certification verification
   - Reference management
   - Video introduction uploads

### Integration Points
- Assessment results now consider candidate profiles
- Recruiter matching algorithms can leverage detailed profiles
- Analytics dashboard can show profile completion impact on assessment performance

## Usage Examples

### For Candidates
1. Complete basic information in Profile Settings
2. Add personal details including LinkedIn URL
3. Fill out professional information
4. Use LinkedIn import for faster profile completion (when available)
5. Review profile completion percentage and fill missing fields

### For System Administrators
1. Monitor profile completion rates across candidates
2. Analyze correlation between profile completeness and assessment performance
3. Configure LinkedIn API credentials for import functionality

### For Developers
1. Use the enhanced User model for profile-aware features
2. Leverage candidateProfile in AI evaluation requests
3. Extend profile fields as needed for specific requirements

## Technical Specifications

- **Database**: MongoDB with Mongoose schemas
- **Authentication**: NextAuth.js integration
- **Validation**: Server-side validation with proper error handling
- **UI Framework**: React with Tailwind CSS
- **TypeScript**: Full type safety for profile data structures
- **API Design**: RESTful endpoints with proper HTTP methods

This profile management system provides a solid foundation for comprehensive candidate profiling while maintaining flexibility for future enhancements and integrations.
