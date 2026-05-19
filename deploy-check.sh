#!/bin/bash

echo "==================================="
echo "  DoneRight Deployment Check"
echo "==================================="
echo ""

# Check if .env exists
echo "1. Checking environment variables..."
if [ -f ".env" ]; then
    echo "   ✅ .env file exists"
    if grep -q "VITE_API_URL" .env; then
        API_URL=$(grep "VITE_API_URL" .env | cut -d '=' -f2)
        echo "   ✅ VITE_API_URL found: $API_URL"
    else
        echo "   ❌ VITE_API_URL not found in .env"
        echo "   Add: VITE_API_URL=https://your-backend.onrender.com/api"
    fi
else
    echo "   ⚠️  .env file not found"
    echo "   Create .env with: VITE_API_URL=https://your-backend.onrender.com/api"
fi
echo ""

# Check backend .env
echo "2. Checking backend environment..."
if [ -f "backend/.env" ]; then
    echo "   ✅ backend/.env exists"
    if grep -q "DATABASE_URL" backend/.env; then
        echo "   ✅ DATABASE_URL configured"
    else
        echo "   ❌ DATABASE_URL not found"
    fi
    if grep -q "JWT_SECRET" backend/.env; then
        echo "   ✅ JWT_SECRET configured"
    else
        echo "   ❌ JWT_SECRET not found"
    fi
else
    echo "   ❌ backend/.env not found"
fi
echo ""

# Test frontend build
echo "3. Testing frontend build..."
pnpm build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ Frontend builds successfully"
    BUILD_SIZE=$(du -sh dist/ | cut -f1)
    echo "   📦 Build size: $BUILD_SIZE"
else
    echo "   ❌ Frontend build failed"
    echo "   Run: pnpm build"
fi
echo ""

# Check if backend can start
echo "4. Testing backend..."
cd backend
if [ -f "server.js" ]; then
    echo "   ✅ server.js exists"
    if [ -d "node_modules" ]; then
        echo "   ✅ Dependencies installed"
    else
        echo "   ⚠️  Backend dependencies not installed"
        echo "   Run: cd backend && pnpm install"
    fi
else
    echo "   ❌ server.js not found"
fi
cd ..
echo ""

# Check git status
echo "5. Checking git status..."
if [ -d ".git" ]; then
    echo "   ✅ Git repository initialized"
    UNCOMMITTED=$(git status --porcelain | wc -l)
    if [ $UNCOMMITTED -eq 0 ]; then
        echo "   ✅ All changes committed"
    else
        echo "   ⚠️  $UNCOMMITTED uncommitted changes"
        echo "   Run: git add . && git commit -m 'Your message'"
    fi
else
    echo "   ❌ Not a git repository"
    echo "   Run: git init"
fi
echo ""

echo "==================================="
echo "  Deployment Readiness Summary"
echo "==================================="
echo ""
echo "✅ = Ready"
echo "⚠️  = Needs attention"
echo "❌ = Required fix"
echo ""
echo "Next steps:"
echo "1. Fix any ❌ or ⚠️  issues above"
echo "2. Push to GitHub: git push"
echo "3. Deploy backend to Render.com"
echo "4. Deploy frontend to Vercel.com"
echo "5. Test: https://your-app.vercel.app"
echo ""
