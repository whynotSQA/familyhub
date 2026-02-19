#!/bin/bash
# Git Commit Script for FamilyHub Shopping List Manager
# Execute this script to commit all changes to Git

echo "🚀 FamilyHub Shopping List Manager - Git Commit Script"
echo "======================================================"
echo ""

# Navigate to project directory
cd /home/ubuntu/.openclaw/workspace/familyhub-shopping

# Check if Git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
    echo ""
fi

# Configure Git user (replace with your info)
echo "⚙️  Configuring Git user..."
echo "Please enter your Git user name:"
read GIT_USER_NAME
echo "Please enter your Git email:"
read GIT_USER_EMAIL

git config user.name "$GIT_USER_NAME"
git config user.email "$GIT_USER_EMAIL"
echo "✅ Git user configured"
echo ""

# Show status
echo "📊 Current Git status:"
git status
echo ""

# Add all files
echo "➕ Adding all files to Git..."
git add .
echo "✅ Files added"
echo ""

# Show what will be committed
echo "📋 Files to be committed:"
git status --short
echo ""

# Commit
echo "💾 Creating commit..."
git commit -m "Initial commit: FamilyHub Shopping List Manager MVP

Features implemented:
- ✅ Core shopping list CRUD operations (add, view, bought, remove)
- ✅ Smart categorization (10+ categories: Dairy, Produce, Meat, etc.)
- ✅ Multi-user tracking (Mom, Dad, Emma)
- ✅ Store location management (JJ Bakery, 99 Ranch, Costco, Walmart)
- ✅ Smart purchase suggestions based on history (cycle detection)
- ✅ Web Dashboard with dual views (By Category / By Store)
- ✅ Natural language parser (English & Chinese commands)
- ✅ SQLite database with complete schema (shopping_items, purchase_history)
- ✅ Express REST API server (4 endpoints)
- ✅ Modern gradient UI design (blue-purple theme)
- ✅ All features English-only (database, UI, API responses)
- ✅ Auto-refresh every 30 seconds
- ✅ Real-time statistics

Documentation:
- 📝 README.md - Project overview and quick start
- 📝 REQUIREMENTS.md - Detailed feature checklist (55 requirements)
- 📝 ARCHITECTURE.md - Code architecture and database schema
- 📝 IMPLEMENTATION_STATUS.md - Implementation report
- 📝 SUMMARY.md - Project completion summary
- 📝 GIT_COMMIT_GUIDE.md - Git commit instructions

Current Status:
- 📊 Overall completion: 53% (29/55 features)
- ✅ MVP completion: 100% (all critical features)
- ✅ Production ready for family use
- 💰 Total cost: $0 (completely free)

Technical Stack:
- Node.js + Express.js
- SQLite3 (better-sqlite3)
- Vanilla JavaScript (no framework)
- Cloudflare Tunnel (public HTTPS)
- OpenClaw Framework

Data:
- 14 items in shopping list
- 4 stores (JJ Bakery, 99 Ranch, Costco, Walmart)
- 7 categories
- 3 users (Mom, Dad, Emma)
- 6 purchase history records"

echo "✅ Commit created successfully!"
echo ""

# Show commit info
echo "📄 Commit details:"
git log -1 --stat
echo ""

# Instructions for GitHub push
echo "🔗 Next steps to push to GitHub:"
echo ""
echo "1. Create a new repository on GitHub (if not already created)"
echo "   Visit: https://github.com/new"
echo "   Repository name: familyhub-shopping"
echo "   Description: AI-powered shopping list manager for families"
echo "   Public or Private: Your choice"
echo "   Do NOT initialize with README, .gitignore, or license"
echo ""
echo "2. Add GitHub remote (replace YOUR_USERNAME with your GitHub username):"
echo "   git remote add origin https://github.com/YOUR_USERNAME/familyhub-shopping.git"
echo ""
echo "3. Push to GitHub:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "✅ All done! Your changes are committed locally."
echo "🚀 Follow the steps above to push to GitHub."
