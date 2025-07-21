import React, { useState } from 'react';
import { ChatBotWidget } from 'chatbot-widget-ui';
import { sendChatMessage } from '@/service/aiService';
import { useAuth } from '../auth/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import styles from './style.module.css';

interface Message {
  role: string;
  content: string;
}

const ChatBubble: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { username, isAuthenticated } = useAuth();
  const [anonymousId] = useState(() => uuidv4()); // Generate random ID once for anonymous users


  const customApiCall = async (message: string) => {
    try {
      const response = await sendChatMessage({
        message,
        userId: isAuthenticated ? username! : anonymousId
      });
      console.log("customApiCall response: ", response);
      return response;
    } catch (err) {
      console.error('Chat error:', err);
      return '出错了..请重试';
    }
  };

  const handleNewMessage = (newMsg: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMsg]);
  };

  const handleBotResponse = (response: string) => {
    console.log("Bot Response:", response);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
  };

  return (
    <div className={styles.chatBotWidget}>
      <ChatBotWidget
        callApi={customApiCall}
        onBotResponse={handleBotResponse}
        handleNewMessage={handleNewMessage}
        isTypingMessage="正在输入..."
        messages={messages}
        chatbotName="在线客服"
        chatIcon={<div style={{ fontSize: 24 }}>💬</div>}
        botIcon={<div style={{ fontSize: 20 }}>🤖</div>}
        primaryColor="var(--button-primary-color)"
      />
    </div>
  );
};

export default ChatBubble;
