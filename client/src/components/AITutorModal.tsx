import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  codeSnippet?: string;
  suggestion?: {
    type: 'fix' | 'optimize' | 'explain';
    title: string;
    description: string;
    code?: string;
  };
}

interface LearningContext {
  currentTopic?: string;
  strugglingWith?: string[];
  strengths?: string[];
  lastCode?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export function AITutorModal({ isOpen, onClose }: AITutorModalProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [learningContext, setLearningContext] = useState<LearningContext>({});
  const [tutorMode, setTutorMode] = useState<'chat' | 'code-review' | 'practice'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLittleCoder = user?.ageGroup === '6-11';

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeTutor();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeTutor = () => {
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: isLittleCoder 
        ? "Hi there! 🌟 I'm your AI coding buddy! I'm here to help you learn programming in a fun way. What would you like to explore today? You can ask me about coding concepts, show me your code, or let's practice together!"
        : "Hello! I'm your AI programming tutor. I'm here to provide personalized coding guidance, review your code, explain complex concepts, and help you overcome programming challenges. What would you like to work on today?",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const generateAIResponse = async (userMessage: string): Promise<ChatMessage> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowercaseMessage = userMessage.toLowerCase();
    
    // Advanced tutoring responses based on context
    let response = '';
    let suggestion = undefined;

    if (lowercaseMessage.includes('error') || lowercaseMessage.includes('bug') || lowercaseMessage.includes('not working')) {
      response = isLittleCoder 
        ? "Oh no! Don't worry, every coder gets bugs - they're like puzzles to solve! 🐛 Can you show me your code? I'll help you find what's wrong and fix it together!"
        : "I'd be happy to help debug your code. Please share the error message and your code snippet. I'll analyze it and provide specific solutions along with explanations of what went wrong.";
      
      suggestion = {
        type: 'fix' as const,
        title: 'Debug Together',
        description: 'Share your code and I\'ll help identify and fix the issue',
        code: '// Paste your code here and I\'ll help debug it'
      };
    } else if (lowercaseMessage.includes('loop') || lowercaseMessage.includes('repeat')) {
      response = isLittleCoder
        ? "Loops are super cool! 🔄 They're like telling the computer 'do this again and again!' Think of it like brushing your teeth every morning - you repeat the same steps. Want to see some fun loop examples?"
        : "Loops are fundamental control structures that allow you to execute code repeatedly. Let me explain the different types of loops and when to use each one. Would you like to see practical examples?";
      
      suggestion = {
        type: 'explain' as const,
        title: 'Loop Practice',
        description: 'Try this interactive loop exercise',
        code: isLittleCoder 
          ? 'for i in range(5):\n    print("Hello!", i)'
          : 'for (let i = 0; i < 10; i++) {\n    console.log(`Count: ${i}`);\n}'
      };
    } else if (lowercaseMessage.includes('function') || lowercaseMessage.includes('method')) {
      response = isLittleCoder
        ? "Functions are like magic spells! ✨ You give them a name, and when you say the name, they do something special. It's like having a robot helper that knows exactly what to do!"
        : "Functions are reusable blocks of code that perform specific tasks. They help organize your code, reduce repetition, and make programs more maintainable. Let me show you how to create effective functions.";
      
      suggestion = {
        type: 'explain' as const,
        title: 'Function Workshop',
        description: 'Learn to create and use functions effectively',
        code: isLittleCoder
          ? 'def say_hello(name):\n    print(f"Hello, {name}!")\n\nsay_hello("Friend")'
          : 'function calculateArea(length, width) {\n    return length * width;\n}\n\nconst area = calculateArea(5, 3);'
      };
    } else if (lowercaseMessage.includes('variable') || lowercaseMessage.includes('store')) {
      response = isLittleCoder
        ? "Variables are like magical boxes! 📦 You can put numbers, words, or anything inside them and use them later. Each box has a name so you remember what's inside!"
        : "Variables are containers that store data values. Understanding variable scope, types, and naming conventions is crucial for writing clean, maintainable code. Let me explain the best practices.";
    } else if (lowercaseMessage.includes('array') || lowercaseMessage.includes('list')) {
      response = isLittleCoder
        ? "Arrays are like toy boxes with numbered spots! 🧸 You can put lots of things in order and find them by their number. Want to see how to make your own toy box?"
        : "Arrays are data structures that store multiple elements in a single variable. They're essential for handling collections of data efficiently. Let me show you array methods and best practices.";
    } else if (lowercaseMessage.includes('help') || lowercaseMessage.includes('stuck')) {
      response = isLittleCoder
        ? "Don't worry! Getting stuck is part of learning - even the best coders get stuck sometimes! 🤗 Tell me what you're working on and I'll help you figure it out step by step!"
        : "I'm here to help! Getting stuck is a normal part of programming. Can you describe the specific challenge you're facing? I'll provide targeted guidance and break it down into manageable steps.";
    } else {
      response = isLittleCoder
        ? "That's a great question! 🌟 I love helping curious coders like you! Can you tell me more about what you're trying to do? The more you tell me, the better I can help!"
        : "I'd be happy to help with that! Could you provide more context about your specific programming challenge or learning goal? This will help me give you the most relevant and useful guidance.";
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      suggestion
    };
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(input);
      setMessages(prev => [...prev, aiResponse]);
      
      // Update learning context based on conversation
      setLearningContext(prev => ({
        ...prev,
        currentTopic: extractTopic(input),
        lastCode: extractCode(input)
      }));
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'm having trouble right now. Please try again in a moment!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const extractTopic = (message: string): string => {
    const topics = ['loops', 'functions', 'variables', 'arrays', 'objects', 'classes'];
    return topics.find(topic => message.toLowerCase().includes(topic)) || 'general';
  };

  const extractCode = (message: string): string | undefined => {
    const codePattern = /```[\s\S]*?```|`[^`]+`/;
    const match = message.match(codePattern);
    return match ? match[0] : undefined;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const switchMode = (mode: 'chat' | 'code-review' | 'practice') => {
    setTutorMode(mode);
    const modeMessages = {
      'code-review': "Great! I'm ready to review your code. Paste your code below and I'll provide detailed feedback, suggestions for improvement, and explain any issues I find.",
      'practice': "Perfect! Let's practice together. I'll give you coding challenges that match your skill level. What topic would you like to practice? Loops, functions, arrays, or something else?",
      'chat': "I'm here to chat and answer any programming questions you have! What would you like to learn about?"
    };

    const modeMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: modeMessages[mode],
      timestamp: new Date()
    };
    setMessages(prev => [...prev, modeMessage]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div>
            <h2 className="text-2xl font-bold">🤖 AI Programming Tutor</h2>
            <p className="text-purple-100 text-sm">
              {isLittleCoder ? "Your friendly coding buddy!" : "Personal AI mentor for programming"}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 transition"
          >
            <i className="fa-solid fa-times text-2xl"></i>
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex border-b bg-gray-50">
          {['chat', 'code-review', 'practice'].map((mode) => (
            <button
              key={mode}
              onClick={() => switchMode(mode as any)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition ${
                tutorMode === mode
                  ? 'bg-white text-purple-600 border-b-2 border-purple-500'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-gray-100'
              }`}
            >
              {mode === 'chat' && '💬'} {mode === 'code-review' && '🔍'} {mode === 'practice' && '💪'}
              {' '}
              {mode.charAt(0).toUpperCase() + mode.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.suggestion && (
                  <div className="mt-3 p-3 bg-white bg-opacity-20 rounded-lg border">
                    <div className="font-semibold text-sm mb-1">💡 {message.suggestion.title}</div>
                    <div className="text-sm opacity-90 mb-2">{message.suggestion.description}</div>
                    {message.suggestion.code && (
                      <pre className="text-xs bg-black bg-opacity-20 p-2 rounded overflow-x-auto">
                        <code>{message.suggestion.code}</code>
                      </pre>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-4 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-gray-600 text-sm">AI Tutor is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex space-x-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                tutorMode === 'code-review' 
                  ? "Paste your code here for review..."
                  : tutorMode === 'practice'
                  ? "What would you like to practice?"
                  : "Ask me anything about programming..."
              }
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}