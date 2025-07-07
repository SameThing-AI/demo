#!/bin/bash

# Demo script for SameThing.AI - AI-Powered Hiring Assessments
# This script sets up and demonstrates the platform

echo "🚀 SameThing.AI - AI-Powered Hiring Assessments Demo"
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Creating .env.local file..."
    cp .env.local.example .env.local
    echo "📝 Please add your OpenAI API key to .env.local"
    echo "   You can get one from: https://platform.openai.com/api-keys"
fi

echo ""
echo "🎯 Demo Features:"
echo "• AI-powered assessment generation"
echo "• Custom questions based on job requirements"
echo "• Beautiful, responsive interface"
echo "• Export functionality"
echo "• Weighted scoring criteria"
echo ""

echo "🚀 Starting the development server..."
echo "   The app will be available at: http://localhost:3000"
echo ""
echo "📋 Demo Flow:"
echo "1. Click 'Create Your First Assessment'"
echo "2. Fill in job details (try: Senior Frontend Developer at Google)"
echo "3. Generate AI assessment"
echo "4. Review questions and criteria"
echo "5. Export the assessment"
echo ""

# Start the development server
npm run dev
