# 🚀 AI-Powered Hiring Assessment Platform

[![CI/CD Pipeline](https://github.com/your-org/ai-hiring-assessments/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/your-org/ai-hiring-assessments/actions)
[![Code Quality](https://github.com/your-org/ai-hiring-assessments/workflows/Code%20Quality%20Check/badge.svg)](https://github.com/your-org/ai-hiring-assessments/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A revolutionary AI-powered platform for creating, managing, and evaluating technical hiring assessments. Built with Next.js 14, TypeScript, MongoDB, and OpenAI GPT-4o.

## ✨ Features

### 🧠 Revolutionary AI Assessments
- **Live Simulation Engine**: Immersive, scenario-based assessments that simulate real work environments
- **Dynamic Content Generation**: AI-powered assessment creation tailored to specific roles and companies
- **Intelligent Evaluation**: GPT-4o powered assessment scoring and detailed feedback
- **Anti-Cheat Technology**: Advanced monitoring for tab switching, copy-paste detection, and more

### 👥 User Management
- **Dual Role System**: Separate interfaces for recruiters and candidates
- **OAuth Integration**: Google OAuth and credential-based authentication
- **Profile Management**: Comprehensive user profiles with skills, experience, and portfolio links
- **Credit System**: Flexible credit-based assessment assignment

### 📊 Analytics & Insights
- **Real-time Analytics**: Track completion rates, average scores, and performance trends
- **Detailed Reporting**: Comprehensive assessment reports with skill breakdowns
- **Performance Monitoring**: Built-in logging, metrics, and error tracking
- **Export Capabilities**: PDF reports and data export functionality

### 🏗️ Enterprise-Ready Architecture
- **Scalable Infrastructure**: MongoDB with optimized indexing and connection pooling
- **Security First**: Comprehensive input validation, rate limiting, and security headers
- **Performance Optimized**: Bundle analysis, lazy loading, and caching strategies
- **CI/CD Pipeline**: Automated testing, quality checks, and deployment

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend
- **Next.js API Routes** 
- **MongoDB** with Mongoose ODM
- **NextAuth.js** for authentication
- **OpenAI GPT-4o** for AI capabilities
- **bcryptjs** for password hashing

### DevOps & Quality
- **Jest** for unit testing
- **Playwright** for E2E testing
- **ESLint** for code linting
- **Prettier** for code formatting
- **GitHub Actions** for CI/CD

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm 8+
- MongoDB instance (local or cloud)
- OpenAI API key
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/ai-hiring-assessments.git
   cd ai-hiring-assessments
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following environment variables:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/ai-hiring-assessments
   
   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key-min-32-chars
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # OpenAI
   OPENAI_API_KEY=your-openai-api-key
   
   # JWT
   JWT_SECRET=your-jwt-secret-key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 📚 Usage Guide

### For Recruiters

1. **Registration**: Sign up with company email and select "Recruiter" role
2. **Create Assessments**: 
   - Standard assessments with custom questions
   - Revolutionary AI-powered simulations
3. **Assign to Candidates**: Send assessment links via email
4. **Review Results**: Analyze performance with detailed reports

### For Candidates

1. **Registration**: Sign up and complete your profile
2. **Take Assessments**: Access via shared links or assignments
3. **Experience Simulations**: Engage with realistic work scenarios
4. **View Results**: Access scores and feedback (if enabled)

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### E2E Tests
```bash
# Run E2E tests
npm run test:e2e

# Run with UI mode
npm run test:e2e:ui
```

### Type Checking
```bash
npm run type-check
```

## 🔧 Development

### Code Quality
```bash
# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Check formatting
npx prettier --check "**/*.{js,jsx,ts,tsx,json,css,md}"
```

### Bundle Analysis
```bash
npm run analyze
```

### Database Operations
```bash
# Seed database
npm run db:seed

# Run migrations
npm run db:migrate
```

## 📊 Performance & Monitoring

### Built-in Monitoring
- **Request/Response Timing**: API performance tracking
- **Error Tracking**: Comprehensive error logging
- **Memory Usage**: Real-time memory monitoring
- **User Actions**: Detailed user interaction tracking

### Performance Optimizations
- **Bundle Splitting**: Optimized code splitting
- **Image Optimization**: Next.js Image component with WebP/AVIF
- **Caching**: Comprehensive caching strategy
- **Lazy Loading**: Component and route-based lazy loading

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker Deployment
```bash
# Build Docker image
docker build -t ai-hiring-assessments .

# Run container
docker run -p 3000:3000 ai-hiring-assessments
```

## 🏗️ Architecture

### Directory Structure
```
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   └── take-assessment/  # Assessment interface
├── components/           # Reusable UI components
├── lib/                  # Utility libraries
│   ├── config.ts        # Configuration management
│   ├── monitoring.ts    # Logging and metrics
│   ├── performance.ts   # Performance utilities
│   └── validation.ts    # Input validation
├── models/              # Database models
├── types/               # TypeScript type definitions
├── tests/               # Test files
└── public/              # Static assets
```

### Key Components

#### Revolutionary Assessment Engine
- **LiveSimulationEngine**: Creates immersive work simulations
- **AI Content Generator**: Dynamic assessment content creation
- **Anti-Cheat System**: Advanced monitoring and detection
- **Performance Tracking**: Real-time assessment analytics

#### Security Features
- **Input Validation**: Comprehensive client and server-side validation
- **Rate Limiting**: API endpoint protection
- **Security Headers**: OWASP-compliant security headers
- **Data Encryption**: Secure password hashing and JWT tokens

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Use conventional commit messages
- Ensure code passes all quality checks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Documentation**: [View Docs](docs/)
- **API Reference**: [API Docs](docs/api.md)
- **Deployment Guide**: [Deploy Docs](docs/deployment.md)
- **Contributing**: [Contribution Guidelines](CONTRIBUTING.md)

## 📞 Support

- **Email**: support@ai-hiring.com
- **Issues**: [GitHub Issues](https://github.com/your-org/ai-hiring-assessments/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/ai-hiring-assessments/discussions)

---

Built with ❤️ by the AI Hiring Team
