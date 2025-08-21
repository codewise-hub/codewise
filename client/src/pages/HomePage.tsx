import { useState } from 'react';
import { CourseExplanationModal } from '@/components/CourseExplanationModal';
import type { AgeGroup } from '@/types/user';

interface HomePageProps {
  onAuthModalOpen: (mode: 'signin' | 'signup', role?: string, ageGroup?: string) => void;
}

export function HomePage({ onAuthModalOpen }: HomePageProps) {
  const [showCourseExplanation, setShowCourseExplanation] = useState(false);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('6-11');
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero Section */}
      <section id="home" className="gradient-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Explore. Learn. Code.
              <span className="block text-yellow-300">Together!</span>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
              Dive into fun, interactive coding adventures designed for young minds. 
              Build amazing projects, learn with AI, and become a coding hero!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => onAuthModalOpen('signup')} 
                className="bg-yellow-400 text-purple-800 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition bounce-animation"
              >
                <i className="fa-solid fa-rocket mr-2"></i>Start Learning Now - FREE!
              </button>
              <button 
                onClick={() => scrollToSection('courses')} 
                className="bg-white text-purple-800 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition"
              >
                <i className="fa-solid fa-play mr-2"></i>Explore Courses
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Age Selection */}
      <section id="courses" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Choose Your Learning Path!</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select your age group to discover learning experiences designed just for you
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Little Coders (6-11) */}
            <div className="age-selector student-gradient p-8 rounded-2xl shadow-lg text-center">
              <div className="text-6xl mb-4">🎓</div>
              <h3 className="text-2xl font-bold text-purple-800 mb-4">Little Coders</h3>
              <p className="text-purple-700 mb-4">Ages 6-11</p>
              <div className="text-sm text-purple-600 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <i className="fa-solid fa-puzzle-piece mr-2"></i>Visual Block Programming
                </div>
                <div className="flex items-center justify-center mb-2">
                  <i className="fa-solid fa-robot mr-2"></i>Robotics & Animations
                </div>
                <div className="flex items-center justify-center mb-2">
                  <i className="fa-solid fa-microchip mr-2"></i>Micro:bit Adventures
                </div>
                <div className="flex items-center justify-center">
                  <i className="fa-solid fa-gamepad mr-2"></i>Game Creation
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setSelectedAgeGroup('6-11');
                    setShowCourseExplanation(true);
                  }}
                  className="bg-purple-200 text-purple-800 px-4 py-2 rounded-lg font-medium hover:bg-purple-300 transition"
                  data-testid="button-little-coder-info"
                >
                  <i className="fa-solid fa-info-circle mr-2"></i>Learn More About Courses
                </button>
                <button 
                  onClick={() => onAuthModalOpen('signup', 'student', '6-11')} 
                  className="bg-white text-purple-800 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition"
                  data-testid="button-signup-little-coder"
                >
                  Start Adventure
                </button>
              </div>
            </div>

            {/* Teen Coders (12-17) */}
            <div className="age-selector teacher-gradient p-8 rounded-2xl shadow-lg text-center">
              <div className="text-6xl mb-4">💻</div>
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Teen Coders</h3>
              <p className="text-blue-700 mb-4">Ages 12-17</p>
              <div className="text-sm text-blue-600 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <i className="fa-solid fa-code mr-2"></i>Python & JavaScript
                </div>
                <div className="flex items-center justify-center mb-2">
                  <i className="fa-solid fa-globe mr-2"></i>Web Development
                </div>
                <div className="flex items-center justify-center mb-2">
                  <i className="fa-solid fa-mobile-alt mr-2"></i>App Development
                </div>
                <div className="flex items-center justify-center">
                  <i className="fa-solid fa-brain mr-2"></i>AI & Machine Learning
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setSelectedAgeGroup('12-17');
                    setShowCourseExplanation(true);
                  }}
                  className="bg-blue-200 text-blue-800 px-4 py-2 rounded-lg font-medium hover:bg-blue-300 transition"
                  data-testid="button-teen-coder-info"
                >
                  <i className="fa-solid fa-info-circle mr-2"></i>Learn More About Courses
                </button>
                <button 
                  onClick={() => onAuthModalOpen('signup', 'student', '12-17')} 
                  className="bg-white text-blue-800 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition"
                  data-testid="button-signup-teen-coder"
                >
                  Start Coding
                </button>
              </div>
            </div>
          </div>

          {/* Role Selection for Teachers/Parents */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
            {/* Teachers */}
            <div className="role-selector teacher-gradient p-6 rounded-xl shadow-lg text-center">
              <div className="text-4xl mb-3">👩‍🏫</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Educators</h3>
              <p className="text-gray-600 mb-4">Manage students and create courses</p>
              <button 
                onClick={() => onAuthModalOpen('signup', 'teacher')} 
                className="bg-white text-gray-800 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
              >
                Join as Teacher
              </button>
            </div>

            {/* Parents */}
            <div className="role-selector parent-gradient p-6 rounded-xl shadow-lg text-center">
              <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
              <h3 className="text-xl font-bold text-white mb-2">Parents</h3>
              <p className="text-gray-100 mb-4">Track your child's progress</p>
              <button 
                onClick={() => onAuthModalOpen('signup', 'parent')} 
                className="bg-white text-gray-800 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
              >
                Join as Parent
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose CodewiseHub Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose CodewiseHub?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive learning platform with age-appropriate content and advanced features
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl text-blue-500 mb-4">
                <i className="fa-solid fa-code"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">Interactive Coding</h3>
              <p className="text-gray-600">Visual blocks for beginners, Monaco editor for advanced learners</p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl text-green-500 mb-4">
                <i className="fa-solid fa-robot"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">Robot Programming</h3>
              <p className="text-gray-600">Control virtual robots with drag-and-drop programming</p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl text-purple-500 mb-4">
                <i className="fa-solid fa-brain"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">AI-Powered Learning</h3>
              <p className="text-gray-600">Personalized assistance and instant coding help</p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl text-orange-500 mb-4">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">Age-Appropriate</h3>
              <p className="text-gray-600">Curriculum designed specifically for different age groups</p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl text-red-500 mb-4">
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">Progress Tracking</h3>
              <p className="text-gray-600">Detailed analytics for students, teachers, and parents</p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl text-cyan-500 mb-4">
                <i className="fa-solid fa-users"></i>
              </div>
              <h3 className="text-xl font-bold mb-4">Multi-Role Support</h3>
              <p className="text-gray-600">Separate dashboards for students, teachers, and parents</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Simple, Affordable Pricing</h2>
            <p className="text-lg text-gray-600">Start free and upgrade as you grow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Free Explorer</h3>
              <div className="text-4xl font-bold text-green-600 mb-4">R0</div>
              <p className="text-gray-600 mb-6">Perfect for getting started</p>
              <ul className="text-left space-y-3 mb-8">
                <li><i className="fa-solid fa-check text-green-500 mr-2"></i>5 Coding Lessons</li>
                <li><i className="fa-solid fa-check text-green-500 mr-2"></i>Basic Projects</li>
                <li><i className="fa-solid fa-check text-green-500 mr-2"></i>Community Support</li>
                <li><i className="fa-solid fa-check text-green-500 mr-2"></i>Progress Tracking</li>
              </ul>
              <button 
                onClick={() => onAuthModalOpen('signup')} 
                className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
              >
                Start Free
              </button>
            </div>

            {/* Basic Plan */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Basic Coder</h3>
              <div className="text-4xl font-bold text-blue-600 mb-4">R349<span className="text-lg">/month</span></div>
              <p className="text-gray-600 mb-6">For serious young coders</p>
              <ul className="text-left space-y-3 mb-8">
                <li><i className="fa-solid fa-check text-blue-500 mr-2"></i>Unlimited Lessons</li>
                <li><i className="fa-solid fa-check text-blue-500 mr-2"></i>Advanced Projects</li>
                <li><i className="fa-solid fa-check text-blue-500 mr-2"></i>AI Tutor Access</li>
                <li><i className="fa-solid fa-check text-blue-500 mr-2"></i>Certificates</li>
                <li><i className="fa-solid fa-check text-blue-500 mr-2"></i>Parent Reports</li>
              </ul>
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition">
                Choose Basic
              </button>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Premium Pro</h3>
              <div className="text-4xl font-bold text-purple-600 mb-4">R699<span className="text-lg">/month</span></div>
              <p className="text-gray-600 mb-6">Complete learning experience</p>
              <ul className="text-left space-y-3 mb-8">
                <li><i className="fa-solid fa-check text-purple-500 mr-2"></i>Everything in Basic</li>
                <li><i className="fa-solid fa-check text-purple-500 mr-2"></i>1-on-1 Mentoring</li>
                <li><i className="fa-solid fa-check text-purple-500 mr-2"></i>Advanced Robotics</li>
                <li><i className="fa-solid fa-check text-purple-500 mr-2"></i>Portfolio Building</li>
                <li><i className="fa-solid fa-check text-purple-500 mr-2"></i>Priority Support</li>
              </ul>
              <button className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition">
                Go Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">CodewiseHub</h3>
              <p className="text-gray-400">Empowering young minds with coding education tailored to their age and skill level.</p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Courses</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Little Coders (Ages 6-11)</li>
                <li>Teen Developers (Ages 12-18)</li>
                <li>Visual Programming</li>
                <li>Professional Coding</li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Interactive Coding Lab</li>
                <li>Robotics Playground</li>
                <li>Age-Appropriate Content</li>
                <li>Progress Tracking</li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CodewiseHub. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Course Explanation Modal */}
      <CourseExplanationModal
        isOpen={showCourseExplanation}
        onClose={() => setShowCourseExplanation(false)}
        ageGroup={selectedAgeGroup}
        onGetStarted={() => onAuthModalOpen('signup', 'student', selectedAgeGroup)}
      />
    </div>
  );
}
