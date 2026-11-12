'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { useModalDismiss } from '@/hooks/useModalDismiss';
import { ToastContainer } from '@/components/Toast';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeData } from '@/lib/recipe-matcher';

interface ProductResult {
  id?: string;
  name: string;
  newPrice: number;
  supplier?: string;
  imageUrl?: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  query?: Record<string, unknown>;
  results?: ProductResult[];
  recipe?: RecipeData;
  type?: 'message' | 'query' | 'error' | 'recipe';
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { toasts, removeToast, success, error: showError } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useModalDismiss(isOpen, onClose);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message with recipe & shopping examples
      setMessages([{
        id: '1',
        text: "Hi! I'm your Grocify AI Assistant. 🍳\n\nI can create personalized recipes, calculate ingredients for any serving size, and automatically add them to your Smart Basket at the lowest prices across stores.\n\nTry asking me:\n• \"Give me an easy Chicken Biryani recipe for 4\"\n• \"Quick 15-minute pasta dinner\"\n• \"Show me breakfast products\"\n• \"Find honey under 1000 rupees\"",
        sender: 'bot',
        timestamp: new Date(),
        type: 'message'
      }]);
    }
  }, [isOpen, messages.length]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'message'
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: currentInput })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message,
        sender: 'bot',
        timestamp: new Date(),
        type: data.type,
        query: data.query,
        results: data.results,
        recipe: data.recipe,
      };

      setMessages(prev => [...prev, botMessage]);

      // If there's a Firebase query, execute it
      if (data.type === 'query' && data.query) {
        await executeQuery(data.query, data.collection);
      }

    } catch (error) {
      console.error('Chat error:', error);
      showError('Failed to send message. Please try again.');

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const executeQuery = async (query: Record<string, unknown>, collection: string) => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/chatbot/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query, collection })
      });

      if (!response.ok) {
        throw new Error('Failed to execute query');
      }

      const data = await response.json();

      // Update the last bot message with results
      setMessages(prev => {
        if (prev.length === 0) return prev;
        const lastMessage = prev[prev.length - 1];
        if (lastMessage.sender !== 'bot') return prev;
        return [
          ...prev.slice(0, -1),
          { ...lastMessage, results: data.results },
        ];
      });

      if (data.count > 0) {
        success(`Found ${data.count} matching products!`);
      } else {
        showError('No products found matching your search. Try adjusting criteria.');
      }

    } catch (error) {
      console.error('Query execution error:', error);
      showError('Failed to execute query. Please try again.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)'
        }}
        onClick={onClose}
      >
        <div
          className="bg-surface rounded-2xl shadow-2xl w-full max-w-2xl h-[680px] max-h-[92vh] flex flex-col border border-gray-200 dark:border-gray-800 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="chatbot-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-surface">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-tr from-green-600 to-emerald-400 rounded-full flex items-center justify-center shadow">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 id="chatbot-title" className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                  Grocify AI Assistant
                  <span className="text-[10px] font-semibold bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 px-2 py-0.5 rounded-full">
                    Recipes &amp; Cart
                  </span>
                </h3>
                <p className="text-xs text-gray-500">Ask for recipes, products, or price comparisons</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close assistant"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => {
              const isUser = message.sender === 'user';
              const hasRecipe = message.type === 'recipe' && message.recipe;

              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2.5 transition ${
                      isUser
                        ? 'bg-green-600 text-white max-w-[85%]'
                        : hasRecipe
                        ? 'bg-transparent w-full max-w-[96%]'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 max-w-[88%]'
                    }`}
                  >
                    {message.text && (
                      <div className="whitespace-pre-wrap text-sm leading-relaxed mb-1">
                        {message.text}
                      </div>
                    )}

                    {/* Interactive Recipe Card */}
                    {hasRecipe && message.recipe && (
                      <RecipeCard
                        recipe={message.recipe}
                        onBasketCreated={() => {
                          // keep modal responsive
                        }}
                      />
                    )}

                    {/* Standard Search Query Results */}
                    {message.results && message.results.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                          Found {message.results.length} products:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {message.results.slice(0, 4).map((result: ProductResult, index: number) => (
                            <div
                              key={index}
                              className="bg-surface border border-gray-200 dark:border-gray-700 rounded-xl p-2.5 text-xs shadow-sm flex flex-col justify-between"
                            >
                              <div>
                                <div className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                                  {result.name}
                                </div>
                                {result.supplier && (
                                  <div className="text-[11px] text-gray-500 mt-0.5">{result.supplier}</div>
                                )}
                              </div>
                              <div className="mt-2 text-sm font-extrabold text-green-600 dark:text-green-400">
                                Rs. {result.newPrice}
                              </div>
                            </div>
                          ))}
                        </div>
                        {message.results.length > 4 && (
                          <div className="text-xs text-gray-500 pt-1">
                            ... and {message.results.length - 4} more products available
                          </div>
                        )}
                      </div>
                    )}

                    <div className="text-[10px] opacity-60 mt-1.5 text-right">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 flex items-center space-x-2.5 shadow-sm">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent" />
                  <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                    Grocify AI is cooking up an answer...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3.5 border-t border-gray-200 dark:border-gray-800 bg-surface">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask for a recipe, meal idea, or search products..."
                className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
                disabled={isLoading}
                autoFocus
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="btn-primary p-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow transition"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

