#!/bin/bash

echo "🕌 Mosque Timing App - Backend Setup"
echo "===================================="
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 1
    fi
fi

# Copy .env.example to .env
cp .env.example .env
echo "✅ Created .env file"

# Generate JWT secret
echo ""
echo "🔐 Generating JWT secret..."
JWT_SECRET=$(openssl rand -base64 32)
echo "✅ Generated JWT secret: ${JWT_SECRET:0:20}..."

# Update .env with JWT secret
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
else
    # Linux
    sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
fi

echo ""
echo "📝 Please configure the following in .env:"
echo "   1. MONGODB_URI - Your MongoDB Atlas connection string"
echo "   2. ALLOWED_ORIGINS - Your frontend URLs"
echo "   3. EXPO_ACCESS_TOKEN (optional) - For better push notification limits"
echo ""

# Ask for MongoDB URI
read -p "Enter your MongoDB URI (or press Enter to skip): " MONGODB_URI
if [ ! -z "$MONGODB_URI" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|MONGODB_URI=.*|MONGODB_URI=$MONGODB_URI|" .env
    else
        sed -i "s|MONGODB_URI=.*|MONGODB_URI=$MONGODB_URI|" .env
    fi
    echo "✅ MongoDB URI configured"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env file with your MongoDB URI (if not done)"
echo "  2. Run 'npm run dev' to start development server"
echo "  3. Run 'npm test' to run tests"
echo ""
echo "For deployment instructions, see DEPLOYMENT_GUIDE.md"
echo ""
