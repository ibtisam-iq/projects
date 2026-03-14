#!/bin/bash

# ============================================
# Projects Site Setup Script
# ============================================
# Creates complete directory structure for
# projects.ibtisam-iq.com
#
# Usage: bash setup-projects-site.sh
# ============================================

set -e  # Exit on error

echo "🚀 Starting Projects Site Setup..."
echo ""

# Create main directory
PROJECT_DIR="projects-site"

if [ -d "$PROJECT_DIR" ]; then
    echo "⚠️  Directory '$PROJECT_DIR' already exists!"
    read -p "Do you want to remove it and continue? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$PROJECT_DIR"
        echo "✅ Removed existing directory"
    else
        echo "❌ Aborted"
        exit 1
    fi
fi

mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

echo "📁 Creating directory structure..."

# Create directories
mkdir -p .github/workflows
mkdir -p public
mkdir -p src/components
mkdir -p src/data
mkdir -p src/types
mkdir -p src/pages

echo "✅ Directory structure created"
echo ""
echo "📝 Creating configuration files..."

# .gitignore
cat > .gitignore << 'EOF'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
EOF

# package.json
cat > package.json << 'EOF'
{
  "name": "projects-site",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-icons": "^5.5.0",
    "react-router-dom": "^7.9.6"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "autoprefixer": "^10.4.22",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.17",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.46.4",
    "vite": "^7.2.4"
  }
}
EOF

# tailwind.config.js
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B0F19",
        card: "#12182A",
        primary: "#7C3AED",
        secondary: "#10B981",
        muted: "#9CA3AF",
      },
    },
  },
  plugins: [],
}
EOF

# postcss.config.js
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# vite.config.ts
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
EOF

# tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
EOF

# tsconfig.app.json
cat > tsconfig.app.json << 'EOF'
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
EOF

# tsconfig.node.json
cat > tsconfig.node.json << 'EOF'
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
EOF

# eslint.config.js
cat > eslint.config.js << 'EOF'
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
EOF

# index.html
cat > index.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Muhammad Ibtisam — DevOps Projects Portfolio. Production-grade deployments, real CI/CD pipelines, and documented infrastructure work." />
    <meta name="keywords" content="DevOps, Docker, Kubernetes, Jenkins, Terraform, CI/CD, Infrastructure, Muhammad Ibtisam" />
    <meta name="author" content="Muhammad Ibtisam" />
    
    <meta property="og:title" content="Projects — Muhammad Ibtisam" />
    <meta property="og:description" content="DevOps Projects Portfolio — Production-grade deployments and infrastructure work" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://projects.ibtisam-iq.com" />
    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Projects — Muhammad Ibtisam" />
    <meta name="twitter:description" content="DevOps Projects Portfolio — Production-grade deployments, real CI/CD pipelines, and documented infrastructure work" />
    
    <title>Projects — Muhammad Ibtisam</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

echo "✅ Configuration files created"
echo ""
echo "📝 Creating source files..."

# src/index.css
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-bg text-white antialiased;
  }
}
EOF

# src/types/project.ts
cat > src/types/project.ts << 'EOF'
export interface Project {
  slug: string
  title: string
  category: "open-source" | "documentation" | "production-grade"
  status: "completed" | "in-progress"
  shortDescription: string
  description: string
  highlights: string[]
  tech: string[]
  githubUrl: string
  blogUrl?: string
  imageUrl?: string
  featured: boolean
}
EOF

# src/data/projects.ts
cat > src/data/projects.ts << 'EOF'
import { Project } from "@/types/project"

export const projects: Project[] = [
  {
    slug: "example-project",
    title: "Example Project",
    category: "production-grade",
    status: "completed",
    shortDescription: "Replace this with your actual projects. Edit src/data/projects.ts to add your projects.",
    description: "This is a placeholder project. Replace with real project data.",
    highlights: [
      "Add your DevOps achievements here",
      "Focus on infrastructure impact",
      "Quantify improvements when possible"
    ],
    tech: ["Docker", "Kubernetes", "Jenkins"],
    githubUrl: "https://github.com/ibtisam-iq",
    featured: true
  }
]

export const getProjectsByCategory = (category: Project["category"]) => {
  return projects.filter(p => p.category === category)
}

export const getProjectsByStatus = (status: Project["status"]) => {
  return projects.filter(p => p.status === status)
}

export const getProjectsByTech = (tech: string) => {
  return projects.filter(p => p.tech.includes(tech))
}

export const getFeaturedProjects = () => {
  return projects.filter(p => p.featured)
}

export const getAllTechTags = (): string[] => {
  const techSet = new Set<string>()
  projects.forEach(p => p.tech.forEach(t => techSet.add(t)))
  return Array.from(techSet).sort()
}
EOF

# src/main.tsx
cat > src/main.tsx << 'EOF'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
EOF

# src/App.tsx (placeholder)
cat > src/App.tsx << 'EOF'
import { BrowserRouter as Router } from "react-router-dom"

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-bg text-white p-8">
        <h1 className="text-4xl font-bold mb-4">Projects Site</h1>
        <p className="text-gray-400">
          ✅ Project structure created successfully!
        </p>
        <p className="text-gray-400 mt-4">
          Next steps:
        </p>
        <ol className="list-decimal list-inside text-gray-400 mt-2 space-y-2">
          <li>Run: npm install</li>
          <li>Add your project data to src/data/projects.ts</li>
          <li>Replace App.tsx and add components based on your full implementation</li>
          <li>Run: npm run dev</li>
        </ol>
      </div>
    </Router>
  )
}

export default App
EOF

# GitHub Actions workflow
cat > .github/workflows/deploy.yml << 'EOF'
name: Projects Site CI/CD

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Add CNAME
        run: echo "projects.ibtisam-iq.com" > dist/CNAME
      
      - name: Add 404 fallback
        run: cp dist/index.html dist/404.html
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
EOF

# public/CNAME
cat > public/CNAME << 'EOF'
projects.ibtisam-iq.com
EOF

# README
cat > README.md << 'EOF'
# Projects — Muhammad Ibtisam

DevOps projects showcase site skeleton created by setup script.

## Setup

npm install
npm run dev

## Build

npm run build

## Add Projects

Edit `src/data/projects.ts` to add your projects.

Replace `src/App.tsx` and add full components following your complete implementation.
EOF


echo "✅ README created"
echo ""
echo "============================================"
echo "✅ Project setup complete!"
echo "============================================"
echo ""
echo "📍 Location: $(pwd)"
echo ""
echo "Next steps:"
echo "  1. cd $PROJECT_DIR"
echo "  2. npm install"
echo "  3. Replace App.tsx and add components based on your full implementation"
echo "  4. Add your projects to src/data/projects.ts"
echo "  5. npm run dev"
echo ""
echo "Happy coding! 🚀"
