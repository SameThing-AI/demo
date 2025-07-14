#!/bin/bash

# AI Hiring Assessments - Database Setup Script

echo "🚀 Setting up AI Hiring Assessments Database..."

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB is not installed. Please install MongoDB first."
    echo "📖 Visit: https://docs.mongodb.com/manual/installation/"
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Starting MongoDB..."
    
    # Try to start MongoDB (works on most systems)
    if command -v brew &> /dev/null; then
        echo "🍺 Starting MongoDB with Homebrew..."
        brew services start mongodb-community
    elif command -v systemctl &> /dev/null; then
        echo "🐧 Starting MongoDB with systemctl..."
        sudo systemctl start mongod
    else
        echo "⚙️  Please start MongoDB manually:"
        echo "   - On macOS with Homebrew: brew services start mongodb-community"
        echo "   - On Linux: sudo systemctl start mongod"
        echo "   - Or run: mongod"
        exit 1
    fi
    
    # Wait for MongoDB to start
    echo "⏳ Waiting for MongoDB to start..."
    sleep 3
fi

echo "✅ MongoDB is running!"

# Test MongoDB connection
echo "🔗 Testing MongoDB connection..."
if mongo --eval "db.runCommand('ping')" ai-hiring-assessments &> /dev/null; then
    echo "✅ Successfully connected to MongoDB!"
else
    echo "❌ Failed to connect to MongoDB. Please check your MongoDB installation."
    exit 1
fi

# Create database and collections
echo "📊 Setting up database structure..."
mongo ai-hiring-assessments --eval "
    db.createCollection('users');
    db.createCollection('assessments');
    db.createCollection('candidateresponses');
    
    // Create indexes for better performance
    db.users.createIndex({ 'email': 1 }, { unique: true });
    db.assessments.createIndex({ 'createdBy': 1, 'createdAt': -1 });
    db.candidateresponses.createIndex({ 'assessmentId': 1, 'candidateId': 1 });
    db.candidateresponses.createIndex({ 'candidateId': 1, 'createdAt': -1 });
    
    print('✅ Database collections and indexes created successfully!');
"

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Make sure your .env.local file has the correct MONGODB_URI"
echo "   2. Set up Google OAuth credentials in .env.local"
echo "   3. Run 'npm run dev' to start the application"
echo ""
echo "🔗 MongoDB connection string: mongodb://localhost:27017/ai-hiring-assessments"
echo ""
