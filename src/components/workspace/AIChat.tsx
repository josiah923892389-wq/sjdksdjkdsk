import { useState, useRef, useEffect } from 'react';
import type { ChatMessage, AIProvider } from '../../types';
import { sendAIMessage, parseCodeFromResponse } from '../../services/api';
import ReactMarkdown from 'react-markdown';

interface AIChatProps {
  onCodeGenerated?: (code: { html?: string; css?: string; js?: string }) => void;
  currentCode?: { html: string; css: string; js: string };
}

export const AIChat = ({ onCodeGenerated, currentCode }: AIChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState<AIProvider>('openai');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Include current code context
      const systemMessage: ChatMessage = {
        id: 'system',
        role: 'system',
        content: `You are an expert web developer assistant. Generate clean, modern HTML, CSS, and JavaScript code. 
        Always provide complete, working code in code blocks with proper language tags (html, css, js).
        ${currentCode ? `\n\nCurrent project code:\nHTML:\n${currentCode.html}\n\nCSS:\n${currentCode.css}\n\nJS:\n${currentCode.js}` : ''}`,
        timestamp: new Date(),
      };

      const response = await sendAIMessage(
        provider,
        [systemMessage, ...messages.filter(m => m.role !== 'system'), userMessage]
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Try to parse and extract code
      const code = parseCodeFromResponse(response);
      if (code.html || code.css || code.js) {
        onCodeGenerated?.(code);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}. Please check your API keys in the environment variables.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const examplePrompts = [
    'Create a modern landing page with a hero section',
    'Build a contact form with validation',
    'Make a responsive navigation bar',
    'Add smooth scroll animations',
  ];

  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 className="font-semibold text-gray-900">AI Assistant</h3>
        </div>
        
        {/* AI Provider selector */}
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value as AIProvider)}
          className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="openai">OpenAI (GPT-4)</option>
          <option value="anthropic">Anthropic (Claude)</option>
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Start a Conversation</h4>
            <p className="text-gray-600 mb-6">Ask AI to help you build your website</p>
            
            {/* Example prompts */}
            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-medium">Try these examples:</p>
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(prompt)}
                  className="block w-full text-left px-4 py-2 text-sm text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="prose prose-sm max-w-none">
                    {message.role === 'assistant' ? (
                      <ReactMarkdown
                        components={{
                          code: ({ children, className }) => {
                            const isBlock = className?.includes('language-');
                            return isBlock ? (
                              <code className={`${className} block bg-gray-800 text-white p-2 rounded text-xs overflow-x-auto`}>
                                {children}
                              </code>
                            ) : (
                              <code className="bg-gray-200 text-gray-800 px-1 rounded text-xs">
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="m-0">{message.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe what you want to build..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows={2}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
