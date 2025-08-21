import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { courseData, roboticsActivities } from "@/data/courseData";
import { AITutorModal } from "@/components/AITutorModal";
import { VideoConferenceModal } from "@/components/VideoConferenceModal";
import { MicrobitDeviceConnector } from "@/components/MicrobitDeviceConnector";
import { RoboticsLabModal } from "@/components/RoboticsLabModal";
import { StudentLearningMaterials } from "@/components/StudentLearningMaterials";

interface StudentDashboardProps {
  onCodingLabOpen: () => void;
}

interface ChatMessage {
  type: 'user' | 'ai';
  message: string;
}

export function StudentDashboard({ onCodingLabOpen }: StudentDashboardProps) {
  const { user } = useAuth();
  const [aiChatInput, setAiChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      type: 'ai',
      message: "Hi! I'm your AI coding assistant. Ask me about programming concepts, debugging help, or project ideas!"
    }
  ]);

  // Advanced feature modals
  const [showAITutor, setShowAITutor] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showDeviceConnector, setShowDeviceConnector] = useState(false);
  const [showRoboticsLab, setShowRoboticsLab] = useState(false);
  const [selectedRoboticsActivity, setSelectedRoboticsActivity] = useState<any>(null);

  const isLittleCoder = user?.ageGroup === '6-11';

  const sendAIMessage = () => {
    if (!aiChatInput.trim()) return;

    // Add user message
    const userMessage: ChatMessage = { type: 'user', message: aiChatInput };
    setChatMessages(prev => [...prev, userMessage]);

    // Generate AI response
    const aiResponse = generateAIResponse(aiChatInput, isLittleCoder);
    const aiMessage: ChatMessage = { type: 'ai', message: aiResponse };

    // Add AI response after a short delay
    setTimeout(() => {
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setAiChatInput('');
  };

  const generateAIResponse = (message: string, isLittleCoder: boolean): string => {
    const lowercaseMessage = message.toLowerCase();
    
    const responses = isLittleCoder ? {
      'help': "I'm here to help! What would you like to learn about coding today? 🌟",
      'loop': "A loop is like doing something over and over! Like brushing your teeth every morning. In coding, we use loops to repeat actions! 🔄",
      'variable': "A variable is like a box where you store things! You can put numbers, words, or other stuff in it and use it later! 📦",
      'function': "A function is like a magic spell! You give it a name and it does something special when you call it! ✨",
      'debug': "Debugging is like being a detective! When your code doesn't work, we look for clues to fix it! 🔍",
      'project': "Let's build something cool! How about making a dancing robot or a color-changing rainbow? 🌈",
      'scratch': "Scratch is super fun! You drag colorful blocks to make your characters move and dance! Want to try it? 🎨",
      'default': "That's a great question! Coding is like solving puzzles with blocks. What would you like to create today? 🧩"
    } : {
      'help': "I'm your AI coding mentor! I can help with programming concepts, debugging, project ideas, and code reviews. What do you need help with?",
      'loop': "Loops are fundamental control structures that repeat code blocks. Common types include for loops, while loops, and do-while loops. They help avoid code duplication and process collections efficiently.",
      'variable': "Variables are named containers that store data values. They have types (string, number, boolean, etc.) and scope (global, local). Good naming conventions make code more readable.",
      'function': "Functions are reusable blocks of code that perform specific tasks. They can take parameters, return values, and help organize code into modular, maintainable pieces.",
      'debug': "Debugging involves identifying and fixing code errors. Use console.log() for JavaScript, print() for Python, or your IDE's debugger. Check for syntax errors, logic errors, and runtime exceptions.",
      'javascript': "JavaScript is a versatile programming language for web development. It handles DOM manipulation, event handling, and can run on both client and server-side with Node.js.",
      'python': "Python is excellent for beginners and powerful for advanced projects. It's used in web development, data science, AI/ML, and automation. The syntax is clean and readable.",
      'project': "Great project ideas: Build a to-do app, create a simple game, develop a weather app using APIs, or try machine learning with TensorFlow.js or Python. What interests you most?",
      'default': "I'm here to help with any programming questions! Whether it's syntax, algorithms, best practices, or project guidance, feel free to ask."
    };
    
    // Find matching response
    for (const [key, response] of Object.entries(responses)) {
      if (lowercaseMessage.includes(key)) {
        return response;
      }
    }
    
    return responses.default;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendAIMessage();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Header */}
      <div className="student-gradient rounded-2xl p-8 mb-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-pink-100">Ready for another coding adventure?</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={onCodingLabOpen}
              className="bg-white text-pink-600 px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition"
            >
              <i className="fa-solid fa-laptop-code mr-2"></i>Lab
            </button>
            <button 
              onClick={() => setShowAITutor(true)}
              className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full font-bold hover:bg-opacity-30 transition"
            >
              <i className="fa-solid fa-robot mr-2"></i>AI Tutor
            </button>
            {user?.ageGroup === '12-17' && (
              <button 
                onClick={() => setShowVideoCall(true)}
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full font-bold hover:bg-opacity-30 transition"
              >
                <i className="fa-solid fa-video mr-2"></i>Video
              </button>
            )}
            <button 
              onClick={() => setShowDeviceConnector(true)}
              className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full font-bold hover:bg-opacity-30 transition"
            >
              <i className="fa-solid fa-microchip mr-2"></i>Device
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="dashboard-card text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
          <div className="text-gray-600">Lessons Completed</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">5</div>
          <div className="text-gray-600">Projects Built</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">8</div>
          <div className="text-gray-600">Badges Earned</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">45</div>
          <div className="text-gray-600">Hours Coded</div>
        </div>
      </div>

      {/* Student Learning Materials */}
      <div className="mb-8">
        <StudentLearningMaterials ageGroup={user?.ageGroup || '6-11'} />
      </div>

      {/* Robotics Activities for Little Coders */}
      {isLittleCoder && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">🤖 Robotics Fun Zone</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roboticsActivities["6-11"].map((activity) => (
              <div 
                key={activity.id} 
                onClick={() => {
                  setSelectedRoboticsActivity(activity);
                  setShowRoboticsLab(true);
                }}
                className="dashboard-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <div className="aspect-square bg-gradient-to-br from-green-100 to-yellow-100 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-3xl">
                    {activity.type === 'maze' ? '🏃' : activity.type === 'puzzle' ? '🧩' : activity.type === 'challenge' ? '🌟' : '🎨'}
                  </div>
                </div>
                <h3 className="font-bold mb-2">{activity.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{activity.description}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    activity.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {activity.difficulty}
                  </span>
                  <span className="text-gray-500 text-xs">⚡ {activity.points} pts</span>
                </div>
                <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
                  Open Robotics Lab
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Continue Learning */}
        <div className="lg:col-span-2">
          <div className="dashboard-card">
            <h2 className="text-xl font-bold mb-4">Continue Learning</h2>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white mr-4">
                  <i className="fa-solid fa-puzzle-piece"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Block Coding Basics</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">3 of 4 lessons complete</div>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                  Continue
                </button>
              </div>
              
              {/* Age-specific content */}
              {isLittleCoder && (
                <>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white mr-4">
                      <i className="fa-solid fa-robot"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Robot Adventures</h3>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">1 of 5 lessons complete</div>
                    </div>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                      Start
                    </button>
                  </div>
                  
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white mr-4">
                      <i className="fa-solid fa-microchip"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Micro:bit Magic</h3>
                      <div className="text-sm text-gray-600">Create LED patterns and games</div>
                    </div>
                    <button className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition">
                      Explore
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Achievements & Progress */}
        <div className="space-y-6">
          {/* AI Coding Assistant */}
          <div className="dashboard-card">
            <h3 className="text-lg font-bold mb-4">
              <i className="fa-solid fa-robot text-blue-500 mr-2"></i>AI Study Helper
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 h-48 overflow-y-auto">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex items-start mb-3 ${msg.type === 'user' ? 'justify-end' : ''}`}>
                  {msg.type === 'ai' && (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-3">
                      <i className="fa-solid fa-robot"></i>
                    </div>
                  )}
                  <div className={`rounded-lg p-2 max-w-xs ${
                    msg.type === 'user' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  {msg.type === 'user' && (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs ml-3">
                      <i className="fa-solid fa-user"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={aiChatInput}
                onChange={(e) => setAiChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about coding..." 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button 
                onClick={sendAIMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="dashboard-card">
            <h3 className="text-lg font-bold mb-4">Overall Progress</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-20 h-20">
                <svg className="w-full h-full progress-ring">
                  <circle cx="40" cy="40" r="32" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="32" 
                    stroke="#10b981" 
                    strokeWidth="6" 
                    fill="none" 
                    className="progress-ring-circle" 
                    style={{ strokeDashoffset: '125.6' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-800">50%</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Level 5 Coder</p>
              <p className="text-sm text-gray-500">250 XP to next level</p>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="dashboard-card">
            <h3 className="text-lg font-bold mb-4">Latest Badges</h3>
            <div className="space-y-3">
              <div className="achievement-badge earned">🎯 First Project</div>
              <div className="achievement-badge earned">🔥 7-Day Streak</div>
              <div className="achievement-badge earned">🎨 Creative Coder</div>
              <div className="achievement-badge">🚀 Speed Builder</div>
              <div className="achievement-badge">🧠 Logic Master</div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Feature Modals */}
      <AITutorModal isOpen={showAITutor} onClose={() => setShowAITutor(false)} />
      <VideoConferenceModal isOpen={showVideoCall} onClose={() => setShowVideoCall(false)} />
      <MicrobitDeviceConnector 
        isOpen={showDeviceConnector} 
        onClose={() => setShowDeviceConnector(false)}
        onDeviceConnected={(device) => console.log('Device connected:', device)}
      />
      <RoboticsLabModal 
        isOpen={showRoboticsLab} 
        onClose={() => setShowRoboticsLab(false)}
        activity={selectedRoboticsActivity}
      />
    </div>
  );
}
