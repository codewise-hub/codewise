import { useState } from 'react';
import { teacherCourseTemplates } from '@/data/courseData';
import { VideoConferenceModal } from '@/components/VideoConferenceModal';
import { AITutorModal } from '@/components/AITutorModal';

export function TeacherDashboard() {
  const [showCourseCreator, setShowCourseCreator] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showAITutor, setShowAITutor] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    ageGroup: '6-11' as '6-11' | '12-17',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    category: 'programming' as 'programming' | 'robotics' | 'web-development' | 'game-development',
    estimatedHours: 10
  });

  const openAICourseGenerator = () => {
    setShowCourseCreator(true);
  };

  const createCourseFromTemplate = (template: any) => {
    setSelectedTemplate(template);
    setNewCourse({
      ...newCourse,
      title: template.title.replace(' Template', ''),
      description: template.description,
      ageGroup: template.ageGroup === 'both' ? '6-11' : template.ageGroup
    });
    setShowCourseCreator(true);
  };

  const saveCourse = () => {
    // TODO: Save course to database
    alert(`Course "${newCourse.title}" created successfully!`);
    setShowCourseCreator(false);
    setSelectedTemplate(null);
    setNewCourse({
      title: '',
      description: '',
      ageGroup: '6-11',
      difficulty: 'beginner',
      category: 'programming',
      estimatedHours: 10
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Header */}
      <div className="teacher-gradient rounded-2xl p-8 mb-8 text-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Teacher Dashboard</h1>
            <p className="text-gray-700">Manage your students and create amazing courses</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={openAICourseGenerator}
              className="bg-white text-teal-600 px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition"
            >
              <i className="fa-solid fa-magic mr-2"></i>AI Generator
            </button>
            <button 
              onClick={() => setShowVideoCall(true)}
              className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full font-bold hover:bg-opacity-30 transition"
            >
              <i className="fa-solid fa-video mr-2"></i>Start Session
            </button>
            <button 
              onClick={() => setShowAITutor(true)}
              className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full font-bold hover:bg-opacity-30 transition"
            >
              <i className="fa-solid fa-robot mr-2"></i>AI Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="dashboard-card text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">24</div>
          <div className="text-gray-600">Active Students</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">8</div>
          <div className="text-gray-600">Courses Created</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">156</div>
          <div className="text-gray-600">Assignments Graded</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
          <div className="text-gray-600">Avg Completion</div>
        </div>
      </div>

      {/* Course Templates */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">📚 Course Creation Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teacherCourseTemplates.map((template) => (
            <div key={template.id} className="dashboard-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="aspect-video bg-gradient-to-br from-teal-100 to-blue-100 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-4xl">
                  {template.id.includes('programming') ? '💻' : 
                   template.id.includes('robotics') ? '🤖' : 
                   template.id.includes('web') ? '🌐' : '🎮'}
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">{template.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{template.description}</p>
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-2">Template includes:</div>
                <ul className="text-xs text-gray-600 space-y-1">
                  {template.sections.slice(0, 3).map((section, idx) => (
                    <li key={idx} className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></div>
                      {section.name} ({section.estimatedHours}h)
                    </li>
                  ))}
                  {template.sections.length > 3 && (
                    <li className="text-gray-400">...and {template.sections.length - 3} more</li>
                  )}
                </ul>
              </div>
              <button 
                onClick={() => createCourseFromTemplate(template)}
                className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition"
              >
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Teacher Tools */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Student Management */}
        <div className="dashboard-card">
          <h2 className="text-xl font-bold mb-4">Student Management</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                  A
                </div>
                <div>
                  <div className="font-semibold">Alice Johnson</div>
                  <div className="text-sm text-gray-600">Level 3 • 85% Progress</div>
                </div>
              </div>
              <div className="text-green-600">
                <i className="fa-solid fa-check-circle"></i>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                  B
                </div>
                <div>
                  <div className="font-semibold">Bob Smith</div>
                  <div className="text-sm text-gray-600">Level 2 • 65% Progress</div>
                </div>
              </div>
              <div className="text-yellow-600">
                <i className="fa-solid fa-clock"></i>
              </div>
            </div>
            
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
              View All Students
            </button>
          </div>
        </div>

        {/* Course Management */}
        <div className="dashboard-card">
          <h2 className="text-xl font-bold mb-4">Course Management</h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold">Introduction to Scratch</div>
              <div className="text-sm text-gray-600 mb-2">12 students enrolled</div>
              <div className="flex space-x-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition">Edit</button>
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition">View</button>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold">Python Basics</div>
              <div className="text-sm text-gray-600 mb-2">8 students enrolled</div>
              <div className="flex space-x-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition">Edit</button>
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition">View</button>
              </div>
            </div>
            
            <button className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition">
              Create New Course
            </button>
          </div>
        </div>
      </div>

      {/* Course Creation Modal */}
      {showCourseCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">
                {selectedTemplate ? `Create Course from Template` : 'AI Course Generator'}
              </h2>
              <button 
                onClick={() => setShowCourseCreator(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fa-solid fa-times text-2xl"></i>
              </button>
            </div>

            <div className="p-6">
              {selectedTemplate && (
                <div className="mb-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <h3 className="font-bold text-teal-800 mb-2">Using Template: {selectedTemplate.title}</h3>
                  <p className="text-teal-700 text-sm">{selectedTemplate.description}</p>
                </div>
              )}

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter course title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Describe what students will learn..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
                    <select
                      value={newCourse.ageGroup}
                      onChange={(e) => setNewCourse({ ...newCourse, ageGroup: e.target.value as '6-11' | '12-17' })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="6-11">Little Coders (6-11)</option>
                      <option value="12-17">Teen Coders (12-17)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                    <select
                      value={newCourse.difficulty}
                      onChange={(e) => setNewCourse({ ...newCourse, difficulty: e.target.value as any })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newCourse.category}
                      onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value as any })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="programming">Programming</option>
                      <option value="robotics">Robotics</option>
                      <option value="web-development">Web Development</option>
                      <option value="game-development">Game Development</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
                    <input
                      type="number"
                      value={newCourse.estimatedHours}
                      onChange={(e) => setNewCourse({ ...newCourse, estimatedHours: parseInt(e.target.value) || 10 })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      min="1"
                      max="100"
                    />
                  </div>
                </div>

                {selectedTemplate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Template Sections</label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {selectedTemplate.sections.map((section: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                          <span className="text-sm">{section.name}</span>
                          <span className="text-xs text-gray-500">{section.estimatedHours}h</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCourseCreator(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveCourse}
                    className="flex-1 bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition"
                  >
                    Create Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Feature Modals */}
      <VideoConferenceModal isOpen={showVideoCall} onClose={() => setShowVideoCall(false)} />
      <AITutorModal isOpen={showAITutor} onClose={() => setShowAITutor(false)} />
    </div>
  );
}
