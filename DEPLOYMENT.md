# 🚀 Deployment Guide

This guide covers different ways to deploy your HeartChat dating app.

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Git for version control

## 🏗️ Build the App

Before deployment, create a production build:

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## 🌐 Deployment Options

### 1. GitHub Pages (Free)

Perfect for demo and portfolio projects.

#### Setup
1. Install GitHub Pages package:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json` scripts:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  },
  "homepage": "https://yourusername.github.io/heartchat-dating-app"
}
```

3. Deploy:
```bash
npm run deploy
```

#### Custom Domain (Optional)
1. Add `CNAME` file to `public/` folder with your domain
2. Configure DNS settings with your domain provider

### 2. Netlify (Free tier available)

Great for continuous deployment and modern web apps.

#### Option A: Drag & Drop
1. Build your app: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag the `build` folder to Netlify

#### Option B: Git Integration
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy automatically on every push

#### Environment Variables
Set in Netlify dashboard if needed:
- `CI=false` (to treat warnings as warnings, not errors)

### 3. Vercel (Free tier available)

Optimized for React and modern frameworks.

#### Deploy with Vercel CLI
1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

#### GitHub Integration
1. Import project from GitHub on [vercel.com](https://vercel.com)
2. Configure build settings (auto-detected for React)
3. Deploy automatically on every push

### 4. Firebase Hosting (Free tier available)

Google's hosting solution with great performance.

#### Setup
1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login and initialize:
```bash
firebase login
firebase init hosting
```

3. Configure `firebase.json`:
```json
{
  "hosting": {
    "public": "build",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

4. Deploy:
```bash
npm run build
firebase deploy
```

### 5. AWS S3 + CloudFront

For production apps requiring AWS infrastructure.

#### Setup S3 Bucket
1. Create S3 bucket with public read access
2. Enable static website hosting
3. Upload `build` folder contents

#### CloudFront Distribution
1. Create CloudFront distribution pointing to S3
2. Configure custom error pages for SPA routing
3. Set up SSL certificate

### 6. Docker Deployment

For containerized deployments.

#### Create Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

#### Build and Run
```bash
docker build -t heartchat-app .
docker run -p 80:80 heartchat-app
```

## 🔧 Configuration

### Environment Variables
Create `.env.production` for production-specific settings:
```env
REACT_APP_API_URL=https://your-api.com
REACT_APP_ANALYTICS_ID=your-analytics-id
```

### Performance Optimization
- Enable gzip compression
- Set proper cache headers
- Use CDN for static assets
- Optimize images and fonts

### Security Headers
Configure these headers for production:
```
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

## 📊 Monitoring

### Analytics
- Google Analytics
- Mixpanel
- Amplitude

### Error Tracking
- Sentry
- LogRocket
- Bugsnag

### Performance Monitoring
- Lighthouse CI
- Web Vitals
- New Relic

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test -- --coverage --watchAll=false
    
    - name: Build app
      run: npm run build
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './build'
        production-branch: main
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🆘 Troubleshooting

### Common Issues

#### Blank Page After Deployment
- Check browser console for errors
- Verify `homepage` in package.json matches deployment URL
- Ensure all assets are loading correctly

#### Routing Issues (404 on refresh)
- Configure server to serve `index.html` for all routes
- Check SPA redirect rules

#### Build Failures
- Check Node.js version compatibility
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall

## 📈 Scaling Considerations

### Database
- Add user authentication
- Implement real user profiles
- Set up data persistence

### Backend API
- Create Express.js or FastAPI backend
- Implement real-time chat with Socket.io
- Add image upload and processing

### Performance
- Implement lazy loading
- Add service worker for caching
- Use React.memo for expensive components

Choose the deployment method that best fits your needs and budget. For personal projects and demos, GitHub Pages or Netlify are excellent free options. For production applications, consider Vercel, AWS, or Firebase for better performance and features. 