
import React, { useState } from 'react';
import getChatbotResponse from '../Chatbot';

const ChatInterface = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (userMessage.trim() === '') return;
    
    try {
      setIsLoading(true);
      const userQuestion = userMessage;
      setUserMessage(''); // Clear input field
      
      // Display user message immediately
      setChatResponse(`You: ${userQuestion}\n\nJarvis is thinking...`);
      
      // Get response from OpenAI
      const response = await getChatbotResponse(userQuestion);
      
      // Update with AI response
      setChatResponse(response);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setChatResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '340px',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(20, 20, 40, 0.8) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '20px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      zIndex: 9999,
      fontFamily: 'Outfit, sans-serif'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '16px' 
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '12px',
          boxShadow: '0 4px 8px rgba(168, 85, 247, 0.3)'
        }}>
          <span style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>AI</span>
        </div>
        <h3 style={{ 
          color: 'white', 
          margin: 0,
          fontWeight: '500',
          fontSize: '18px'
        }}>Jarvis</h3>
      </div>
      
      <div style={{
        color: 'rgba(255, 255, 255, 0.9)',
        minHeight: '60px',
        marginBottom: '16px',
        fontSize: '15px',
        lineHeight: '1.5'
      }}>
        {chatResponse || "Hello! I'm Jarvis, how can I assist you with your real estate photography needs today?"}
      </div>
      
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          style={{
            width: '100%',
            padding: '12px',
            paddingRight: '45px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            color: 'white',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading}
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
            border: 'none',
            borderRadius: '8px',
            padding: '6px 12px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            opacity: isLoading ? '0.7' : '1'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
