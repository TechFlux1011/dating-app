import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

const Chatbot = ({ onComplete }) => {
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    selfDescription: '',
    lookingFor: ''
  });
  const messagesEndRef = useRef(null);
  const hasStartedRef = useRef(false);

  const conversationFlow = [
    {
      bot: "Hey there! 👋 Welcome to HeartChat! I'm here to help you find your perfect match. What should I call you?",
      field: 'name',
      placeholder: 'Enter your name...',
      examples: []
    },
    {
      bot: "Nice to meet you, {name}! 😊 Now, I'd love to get to know the real you. Tell me about yourself - your personality, interests, values, and lifestyle. The more you share, the better I can find your perfect match!",
      field: 'selfDescription',
      placeholder: 'Tell me about yourself...',
      examples: [
        "💡 **Personality**: Am I outgoing or introverted? Creative or analytical? Adventurous or prefer routine?",
        "🎯 **Interests**: What do I love doing? Sports, art, music, reading, cooking, technology, travel?",
        "❤️ **Values**: What's important to me? Family, career, honesty, spirituality, environment, helping others?",
        "🏠 **Lifestyle**: How do I live? Active or laid-back? City or nature? Social or homebody? Organized or spontaneous?",
        "✨ **Example**: \"I'm a creative and introverted person who loves photography and hiking. I value honesty and kindness, and I live an active lifestyle. I'm passionate about environmental causes and enjoy quiet coffee shop conversations.\""
      ]
    },
    {
      bot: "Thanks for sharing! Now, let's talk about your ideal match. What kind of person are you looking for? Think about the personality traits, interests, values, and lifestyle that would complement yours perfectly.",
      field: 'lookingFor',
      placeholder: 'Describe who you\'re looking for...',
      examples: [
        "🎭 **Personality**: Do I want someone similar to me or complementary? Outgoing or calm? Funny or serious?",
        "🎪 **Interests**: What activities would we enjoy together? Shared hobbies or different ones?",
        "💎 **Values**: What must we both care about? Family, career goals, honesty, spirituality, social causes?",
        "🌟 **Lifestyle**: How do we want to live together? Active couple, homebody pair, adventure seekers?",
        "💕 **Relationship Goals**: Am I looking for something casual, serious, long-term, marriage, family?",
        "✨ **Example**: \"I'm looking for someone who shares my love for creativity and outdoor adventures. They should be honest, kind, and value deep conversations. I want someone who's also environmentally conscious and ready for a serious relationship.\""
      ]
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Start conversation only once
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      addBotMessage(conversationFlow[0].bot);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addBotMessage = (message) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: message, 
        timestamp: new Date().toISOString() 
      }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay for more natural feel
  };

  const addUserMessage = (message) => {
    setMessages(prev => [...prev, { 
      type: 'user', 
      text: message, 
      timestamp: new Date().toISOString() 
    }]);
  };

  const addExamplesMessage = () => {
    const currentStepData = conversationFlow[currentStep];
    if (currentStepData.examples && currentStepData.examples.length > 0) {
      const examplesText = `Here are some things you could write about:\n\n${currentStepData.examples.join('\n\n')}`;
      
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: examplesText, 
          timestamp: new Date().toISOString(),
          isExamples: true
        }]);
      }, 500);
    }
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    const currentField = conversationFlow[currentStep].field;
    const updatedUserData = {
      ...userData,
      [currentField]: currentInput
    };

    setUserData(updatedUserData);
    addUserMessage(currentInput);
    setCurrentInput('');
    setShowExamples(false);

    // Move to next step
    if (currentStep < conversationFlow.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Replace {name} placeholder in bot message
      let botMessage = conversationFlow[nextStep].bot;
      if (updatedUserData.name) {
        botMessage = botMessage.replace('{name}', updatedUserData.name);
      }
      
      setTimeout(() => {
        addBotMessage(botMessage);
      }, 1500);
    } else {
      // Conversation complete
      setTimeout(() => {
        addBotMessage("Perfect! 🎉 I've got a great understanding of who you are and what you're looking for. Let me analyze your responses and find your matches...");
        setTimeout(() => {
          onComplete(updatedUserData);
        }, 2000);
      }, 1500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleShowExamples = () => {
    setShowExamples(true);
    addExamplesMessage();
  };

  const renderMessage = (message) => {
    if (message.isExamples) {
      return (
        <div className="examples-content">
          {message.text.split('\n').map((line, index) => {
            if (line.startsWith('💡') || line.startsWith('🎯') || line.startsWith('❤️') || 
                line.startsWith('🏠') || line.startsWith('🎭') || line.startsWith('🎪') || 
                line.startsWith('💎') || line.startsWith('🌟') || line.startsWith('💕')) {
              return <div key={index} className="example-category">{line}</div>;
            } else if (line.startsWith('✨')) {
              return <div key={index} className="example-sample">{line}</div>;
            } else if (line.trim()) {
              return <div key={index} className="example-text">{line}</div>;
            }
            return <br key={index} />;
          })}
        </div>
      );
    }
    return <div className="message-text">{message.text}</div>;
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>💬 Getting to know you</h2>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentStep + 1) / conversationFlow.length) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type} ${message.isExamples ? 'examples' : ''}`}>
            <div className="message-content">
              {renderMessage(message)}
            </div>
            <div className="message-timestamp">
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message bot">
            <div className="message-content typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        {currentStep > 0 && conversationFlow[currentStep].examples.length > 0 && !showExamples && (
          <button 
            onClick={handleShowExamples}
            className="examples-button"
          >
            💡 Show me examples
          </button>
        )}
        
        <div className="input-row">
          <textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={conversationFlow[currentStep]?.placeholder || 'Type your message...'}
            className="message-input"
            rows="3"
          />
          <button 
            onClick={handleSendMessage}
            className="send-button"
            disabled={!currentInput.trim()}
          >
            Send 📨
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot; 