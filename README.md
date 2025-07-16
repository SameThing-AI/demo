# AI Hiring Assessments Platform

A modern, production-ready AI-powered hiring assessment platform built with Next.js 14, MongoDB, and NextAuth.js. This platform enables recruiters to create custom technical evaluations and provides candidates with an interactive assessment experience.

## 🚀 Features

### For Recruiters
- **Assessment Creation**: Create Traditional or AI-Powered assessments with custom questions
- **Candidate Management**: View and manage candidate responses and performance analytics
- **AI-Powered Tools**: Advanced assessment builder with AI assistance
- **Enterprise Integration**: Connect with existing HR systems
- **Real-time Analytics**: Track assessment performance and candidate metrics

### For Candidates
- **Interactive Assessments**: Take assessments with dynamic, adaptive questioning
- **AI Assessment Chatbot**: Get strategic AI guidance during assessments with limited credits per question
- **Profile Management**: Comprehensive profile builder with LinkedIn import support
- **AI Coaching**: Get personalized feedback and improvement suggestions
- **Progress Tracking**: Monitor your assessment history and performance
- **Responsive Design**: Works seamlessly across desktop and mobile devices

### Security & Performance
- **Authentication**: Dual authentication system (Google OAuth + Email/Password)
- **Rate Limiting**: Prevents API abuse with intelligent rate limiting
- **Security Headers**: Comprehensive security headers for production deployment
- **Error Handling**: Robust error boundaries and graceful failure handling
- **Optimized Build**: Production-ready with code splitting and optimization

## 🤖 AI Assessment Chatbot

Our innovative AI Assessment Chatbot provides candidates with strategic AI assistance during assessments, simulating modern work environments where AI tools are commonly used.

### Key Features:
- **Strategic Credit System**: Each question provides credits based on difficulty (Easy: 2, Medium: 3, Hard: 4)
- **Guided Learning**: AI provides hints and guidance without giving direct answers
- **Context-Aware**: Understands job role, description, and specific assessment questions
- **Real-world Simulation**: Reflects actual workplace scenarios where AI assistance is available
- **Fair Evaluation**: Encourages strategic thinking and effective resource utilization

### How it Works:
1. Candidates see available AI credits for each question
2. They can chat with the AI assistant for guidance and hints
3. The AI helps with problem-solving approach without providing direct answers
4. Credits are consumed with each AI interaction
5. Candidates must balance AI assistance with independent thinking

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with Google OAuth and Credentials
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Framer Motion animations
- **Icons**: Lucide React
- **Type Safety**: TypeScript throughout
- **Security**: bcryptjs for password hashing, CSP headers

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB Atlas account or local MongoDB instance
- Google OAuth credentials (optional, for Google Sign-In)
- OpenAI API key (for AI-powered features)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-hiring-assessments
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your actual values:
   ```bash
   # OpenAI API Key (Required for AI features)
   OPENAI_API_KEY=your-openai-api-key-here

   # Next.js Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # MongoDB Configuration (Required)
   MONGODB_URI=your-mongodb-connection-string-here

   # NextAuth Configuration (Required)
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-nextauth-secret-key-here

   # Google OAuth Configuration (Optional)
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   ```

4. **Set up MongoDB**
   - Create a MongoDB Atlas cluster or use a local instance
   - Create a database named `hiring-assessments`
   - Update the `MONGODB_URI` in your `.env.local`

5. **Set up Google OAuth (Optional)**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - Update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`

## 🚀 Development

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **First-time setup**
   - Visit the application
   - Create an account using email/password or Google OAuth
   - Select your role (Recruiter or Candidate) during onboarding

## 🏗 Build & Deployment

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Deploy to Other Platforms
The application is a standard Next.js app and can be deployed to:
- Netlify
- AWS (EC2, Lambda)
- Digital Ocean
- Railway
- Render

## 📁 Project Structure

```
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── candidate/         # Candidate dashboard
│   ├── recruiter/         # Recruiter dashboard
│   └── profile/           # User profile management
├── components/            # Reusable React components
├── contexts/              # React contexts for state management
├── lib/                   # Utility functions and configurations
├── models/                # MongoDB/Mongoose models
└── public/                # Static assets
```

## 🔐 Security Features

- **Password Security**: bcryptjs hashing with salt rounds
- **Rate Limiting**: API endpoint protection against abuse
- **CSRF Protection**: Built-in Next.js CSRF protection
- **Security Headers**: XSS, clickjacking, and content-type protection
- **Input Validation**: Comprehensive server-side validation
- **Error Handling**: Secure error messages without information leakage

- Traditional hiring processes are inefficient and often miss the best candidates
- Generic assessments don't reflect actual job requirements
- Manual assessment creation is time-consuming and inconsistent
- Difficulty in evaluating cultural fit alongside technical skills

## 💡 Solution

Our AI-powered platform:
1. **Analyzes** job requirements and company context
2. **Generates** custom assessments with technical, problem-solving, and behavioral questions
3. **Evaluates** candidates with weighted scoring criteria
4. **Identifies** the best-fit candidates for each role

## 🏗️ Technical Architecture

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **AI Integration**: OpenAI GPT-4 for assessment generation
- **Animations**: Framer Motion for smooth UX
- **Icons**: Lucide React for consistent iconography

## 🛠️ Features

### ✅ Current Features
- **Smart Assessment Generation**: AI creates role-specific questions
- **Multi-Category Questions**: Technical, problem-solving, and behavioral
- **Weighted Scoring**: Customizable evaluation criteria
- **Beautiful UI**: Modern, responsive design
- **Export Functionality**: JSON export for assessments

### 🔄 Planned Features
- **Candidate Portal**: Direct assessment taking interface
- **Real-time Scoring**: Automatic candidate evaluation
- **Analytics Dashboard**: Hiring insights and metrics
- **Integration APIs**: Connect with ATS systems
- **Video Assessments**: AI-powered video interview analysis

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Add your OpenAI API key to `.env.local`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📖 Usage

1. **Create Assessment**: Click "Create Your First Assessment"
2. **Fill Details**: Provide job title, company, and job description
3. **AI Generation**: Our AI analyzes and creates custom questions
4. **Review & Export**: Review the assessment and export if needed
5. **Share**: Use the assessment link to send to candidates

## 🎨 Design Philosophy

- **Clean & Modern**: Minimalist design with focus on functionality
- **Accessible**: WCAG compliant with keyboard navigation
- **Responsive**: Works seamlessly on all devices
- **Fast**: Optimized for performance and speed

## 🔧 Project Structure

```
demo/
├── app/
│   ├── api/
│   │   └── generate-assessment/
│   │       └── route.ts          # AI assessment generation
│   ├── globals.css               # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── components/
│   ├── AssessmentForm.tsx       # Assessment creation form
│   └── AssessmentDisplay.tsx    # Assessment results display
├── public/                      # Static assets
└── package.json
```

## 🌟 Demo Highlights

**Perfect for Y Combinator presentation:**
- Addresses a real $100B+ market (global recruitment)
- AI-first approach with clear differentiation
- Scalable SaaS business model
- Strong technical foundation
- Beautiful, professional interface

## 📊 Market Opportunity

- **Global Recruitment Market**: $200B+ annually
- **ATS Market**: Growing 7% yearly
- **AI in HR**: $1.8B market by 2025
- **Target Customers**: Mid-market companies (100-5000 employees)

## 🚦 Roadmap

### Phase 1: MVP (Current)
- [x] AI assessment generation
- [x] Beautiful frontend interface
- [x] Basic export functionality

### Phase 2: Platform
- [ ] Candidate portal
- [ ] Real-time scoring
- [ ] User accounts & persistence

### Phase 3: Scale
- [ ] Enterprise features
- [ ] API integrations
- [ ] Analytics & reporting

## 🤝 Contributing

This is a demo project for Y Combinator. For production development:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Contact

**SameThing.AI Team**
- Email: founder@samething-ai.com
- Website: https://samething-ai.github.io/home/
<!-- - Demo: https://demo.samething.ai -->

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ for the future of hiring**

*Making hiring decisions based on actual capability, not just resumes.*
