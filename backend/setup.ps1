# Mosque Timing App - Backend Setup Script
# For Windows PowerShell

Write-Host "🕌 Mosque Timing App - Backend Setup" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (Test-Path .env) {
    Write-Host "⚠️  .env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne 'y' -and $overwrite -ne 'Y') {
        Write-Host "Setup cancelled." -ForegroundColor Red
        exit 1
    }
}

# Copy .env.example to .env
Copy-Item .env.example .env
Write-Host "✅ Created .env file" -ForegroundColor Green

# Generate JWT secret
Write-Host ""
Write-Host "🔐 Generating JWT secret..." -ForegroundColor Cyan
$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$JWT_SECRET = [Convert]::ToBase64String($bytes)
Write-Host "✅ Generated JWT secret: $($JWT_SECRET.Substring(0,20))..." -ForegroundColor Green

# Update .env with JWT secret
$envContent = Get-Content .env
$envContent = $envContent -replace 'JWT_SECRET=.*', "JWT_SECRET=$JWT_SECRET"
$envContent | Set-Content .env

Write-Host ""
Write-Host "📝 Please configure the following in .env:" -ForegroundColor Yellow
Write-Host "   1. MONGODB_URI - Your MongoDB Atlas connection string"
Write-Host "   2. ALLOWED_ORIGINS - Your frontend URLs"
Write-Host "   3. EXPO_ACCESS_TOKEN (optional) - For better push notification limits"
Write-Host ""

# Ask for MongoDB URI
$MONGODB_URI = Read-Host "Enter your MongoDB URI (or press Enter to skip)"
if ($MONGODB_URI) {
    $envContent = Get-Content .env
    $envContent = $envContent -replace 'MONGODB_URI=.*', "MONGODB_URI=$MONGODB_URI"
    $envContent | Set-Content .env
    Write-Host "✅ MongoDB URI configured" -ForegroundColor Green
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Edit .env file with your MongoDB URI (if not done)"
Write-Host "  2. Run 'npm run dev' to start development server"
Write-Host "  3. Run 'npm test' to run tests"
Write-Host ""
Write-Host "For deployment instructions, see DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow
Write-Host ""
