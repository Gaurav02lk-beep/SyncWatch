
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { PaperAirplaneIcon } from './Icons';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-2.5 ${msg.user.id === 'u1' ? 'justify-end' : ''}`}>
             {msg.user.id !== 'u1' && msg.user.id !== 'system' && (
                <div className="w-8 h-8 rounded-full bg-primary-200 dark:bg-primary-800 flex items-center justify-center font-bold text-sm text-primary-700 dark:text-primary-200">
                    {msg.user.name.charAt(0)}
                </div>
             )}
            <div className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 ${
                msg.user.id === 'u1' ? 'bg-primary-500 rounded-s-xl rounded-ee-xl' :
                msg.user.id === 'system' ? 'bg-transparent text-center w-full max-w-full' :
                'bg-gray-100 dark:bg-gray-700 rounded-e-xl rounded-es-xl'
            }`}>
              {msg.user.id !== 'system' && (
                <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                    <span className={`text-sm font-semibold ${msg.user.id === 'u1' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{msg.user.name}</span>
                </div>
              )}
              <p className={`text-sm font-normal ${
                msg.user.id === 'u1' ? 'text-white' : 
                msg.user.id === 'system' ? 'text-gray-500 dark:text-gray-400 italic' : 
                'text-gray-900 dark:text-white'}`
              }>{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-gray-50 dark:bg-gray-700 focus:ring-primary-500 focus:border-primary-500"
        />
        <button
          type="submit"
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold p-2.5 rounded-r-lg"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
   