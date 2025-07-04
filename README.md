# 💕 HeartChat - The Dating App That Truly Understands You

HeartChat is a revolutionary dating app that uses intelligent conversation to understand who you are and what you're looking for in a partner. Instead of swiping through endless profiles, you have a personalized conversation with our chatbot that extracts meaningful insights about your personality, interests, and preferences.

## 🌟 Features

- **Conversational Onboarding**: Chat with an AI bot that asks thoughtful questions about you
- **Smart Tag Extraction**: Automatically identifies keywords and interests from your responses
- **Intelligent Matching**: Advanced matching algorithm that finds compatible partners
- **Beautiful Modern UI**: Clean, responsive design with smooth animations
- **Real-time Chat Interface**: Natural conversation flow with typing indicators
- **Match Scoring**: Shows compatibility percentages with detailed explanations
- **Profile Management**: View and manage your extracted tags and preferences

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dating-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## 🎯 How It Works

1. **Welcome**: Start your journey on the beautiful welcome screen
2. **Conversation**: Chat with the AI bot about yourself and your preferences
3. **Tag Extraction**: The app automatically identifies keywords from your responses
4. **Matching**: Advanced algorithm finds compatible users based on shared interests
5. **Browse Matches**: View potential matches with compatibility scores
6. **Profile Details**: Click on matches to see detailed profiles and shared interests

## 🏗️ Technical Architecture

### Components
- **App.js**: Main application component managing state and navigation
- **Chatbot.js**: Conversational interface for user onboarding
- **Matches.js**: Display and interaction with potential matches
- **UserProfile.js**: User profile management and display

### Utilities
- **tagExtractor.js**: Intelligent keyword extraction from text
- **matchingEngine.js**: Advanced matching algorithm with scoring

### Features
- **Local Storage**: Persists user data across sessions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern CSS**: Beautiful gradients, animations, and hover effects
- **Accessibility**: Keyboard navigation and screen reader support

## 🎨 Design Philosophy

HeartChat focuses on understanding users through natural conversation rather than superficial profile browsing. The app creates a more meaningful connection by:

- Encouraging users to express themselves in their own words
- Automatically categorizing interests and personality traits
- Matching based on deeper compatibility rather than just photos
- Providing transparency in match scoring and reasoning

## 🔧 Customization

### Adding New Tag Categories
Edit `src/utils/tagExtractor.js` to add new categories:

```javascript
this.tagCategories = {
  // ... existing categories
  newCategory: ['keyword1', 'keyword2', 'keyword3']
};
```

### Modifying Matching Algorithm
Adjust weights in `src/utils/matchingEngine.js`:

```javascript
this.weights = {
  sharedInterests: 0.4,
  personalityMatch: 0.3,
  valueAlignment: 0.2,
  lifestyleCompatibility: 0.1
};
```

### Styling
All CSS files are located in `src/components/` and can be customized:
- `App.css`: Global styles and welcome screen
- `Chatbot.css`: Chat interface styling
- `Matches.css`: Match cards and modal styling
- `UserProfile.css`: Profile display styling

## 📱 Mobile Support

HeartChat is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones (iOS and Android)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎉 Enjoy HeartChat!

We hope HeartChat helps you find meaningful connections through intelligent conversation and matching. Happy dating! 💕
