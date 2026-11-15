'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { useModalDismiss } from '@/hooks/useModalDismiss';
import { ToastContainer } from '@/components/Toast';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeData } from '@/lib/recipe-matcher';
import { CHATBOT_FAQ_PROMPTS } from '@/lib/chatbot-faq';

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
      // Give users FAQ examples that work even when AI is not configured.
      setMessages([{
        id: '1',
        text: "Hi! I'm your Grocify Assistant. 🛒\n\nI can help you find Imtiaz products, plan recipes, compare prices, or use Grocify. What would you like to do?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'message'
      }]);
    }
  }, [isOpen, messages.length]);

  const sendMessage = async (prompt?: string) => {
    const currentInput = (prompt ?? inputMessage).trim();
    if (!currentInput || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentInput,
      sender: 'user',
      timestamp: new Date(),
      type: 'message'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const token = await user?.getIdToken();
      const history = messages.slice(-10).map((item) => {
        const contextualDetails = item.recipe
          ? `Recipe discussed: ${item.recipe.title}. Serves ${item.recipe.servings}. Ingredients: ${item.recipe.ingredients.map((ingredient) => ingredient.name).slice(0, 12).join(', ')}.`
          : item.results?.length
            ? `Products shown: ${item.results.slice(0, 8).map((product) => `${product.name} (Rs. ${product.newPrice})`).join('; ')}.`
            : '';
        return {
          role: item.sender === 'user' ? 'user' : 'assistant',
          content: [item.text, contextualDetails].filter(Boolean).join('\n').slice(0, 700),
        };
      });
      const response = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: currentInput, history })
      });

      if (!response.ok) {
        const failure = await response.json().catch(() => null);
        throw new Error(failure?.error || 'Failed to get response');
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

      // If there's a structured data query, execute it.
      if (data.type === 'query' && data.query) {
        await executeQuery(data.query, data.collection);
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorText = error instanceof Error ? error.message : 'Failed to send message. Please try again.';
      showError(errorText);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-end justify-end bg-slate-950/45 p-0 backdrop-blur-sm sm:p-5"
        onClick={onClose}
      >
        <div
          className="flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden border border-gray-200 bg-surface text-gray-900 shadow-2xl shadow-black/25 sm:h-[min(760px,calc(100dvh-2.5rem))] sm:max-h-[calc(100dvh-2.5rem)] sm:max-w-[440px] sm:rounded-3xl sm:border-gray-200 dark:sm:border-gray-700"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="chatbot-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-surface px-4 py-3.5 dark:border-gray-700 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-emerald-400 text-white shadow-md shadow-green-900/20">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-lime-400 dark:border-gray-800" />
              </div>
              <div className="min-w-0">
                <h3 id="chatbot-title" className="truncate text-sm font-bold text-gray-900 sm:text-base">
                  Grocify Assistant
                </h3>
                <p className="mt-0.5 truncate text-[11px] text-gray-500">Products, recipes, and shopping help</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              aria-label="Close assistant"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50/70 p-4 dark:bg-background sm:p-5">
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
                        ? 'max-w-[88%] rounded-br-md bg-green-600 text-white shadow-sm'
                        : hasRecipe
                        ? 'bg-transparent w-full max-w-[96%]'
                        : 'max-w-[90%] rounded-bl-md border border-gray-200 bg-surface text-gray-900 shadow-sm dark:border-gray-700'
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
                              className="flex flex-col justify-between rounded-xl border border-gray-200 bg-surface p-2.5 text-xs shadow-sm dark:border-gray-700"
                            >
                              <div>
                                <div className="flex items-start gap-2">
                                  {result.imageUrl && (
                                    <Image
                                      src={result.imageUrl}
                                      alt={result.name}
                                      width={48}
                                      height={48}
                                      className="h-12 w-12 shrink-0 rounded-lg bg-gray-50 object-contain dark:bg-gray-100"
                                    />
                                  )}
                                  <div className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                                    {result.name}
                                  </div>
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

            {messages.length === 1 && messages[0].sender === 'bot' && (
              <div className="flex flex-wrap gap-2 pl-1">
                {CHATBOT_FAQ_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    disabled={isLoading}
                    className="rounded-full border border-green-200 bg-surface px-3 py-1.5 text-xs font-medium text-green-800 shadow-sm transition hover:border-green-300 hover:bg-green-50 disabled:opacity-50 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-950"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2.5 rounded-2xl rounded-bl-md border border-gray-200 bg-surface px-4 py-3 shadow-sm dark:border-gray-700">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
                  <span className="text-xs font-medium text-gray-600">
                    Thinking...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="border-t border-gray-200 bg-surface p-3.5 dark:border-gray-700 sm:p-4">
            <div className="flex items-end gap-2 rounded-2xl border border-gray-300 bg-gray-50 p-1.5 transition focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500/20 dark:border-gray-700 dark:bg-surface-2">
              <textarea
                rows={1}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Grocify..."
                aria-label="Message Grocify assistant"
                className="max-h-24 min-h-10 flex-1 resize-none border-0 bg-transparent px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0"
                disabled={isLoading}
                autoFocus
              />
              <button
                type="button"
                onClick={() => sendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="btn-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
                title="Send message"
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

