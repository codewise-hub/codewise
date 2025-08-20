import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef } from "react";

export function ParentDashboard() {
  const { user } = useAuth();
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Initialize progress chart
    if (chartRef.current && typeof window !== 'undefined') {
      // This would be initialized with Chart.js in a real implementation
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Chart.js initialization would go here
        console.log('Chart initialized');
      }
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Header */}
      <div className="parent-gradient rounded-2xl p-8 mb-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Parent Dashboard</h1>
            <p className="text-purple-100">Track {user?.childName || "your child's"} coding journey</p>
          </div>
          <button className="bg-white text-purple-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition">
            <i className="fa-solid fa-download mr-2"></i>Progress Report
          </button>
        </div>
      </div>

      {/* Child Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="dashboard-card text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">15</div>
          <div className="text-gray-600">Lessons Completed</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">7</div>
          <div className="text-gray-600">Projects Built</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">52</div>
          <div className="text-gray-600">Hours Learned</div>
        </div>
        <div className="dashboard-card text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">Level 4</div>
          <div className="text-gray-600">Current Level</div>
        </div>
      </div>

      {/* Child's Learning Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="dashboard-card">
          <h2 className="text-xl font-bold mb-4">Recent Projects</h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white mr-4">
                <i className="fa-solid fa-gamepad"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Catch the Star Game</h3>
                <div className="text-sm text-gray-600">Completed 2 days ago</div>
              </div>
              <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition">
                View
              </button>
            </div>
            
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center text-white mr-4">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Dancing Robot</h3>
                <div className="text-sm text-gray-600">Completed 5 days ago</div>
              </div>
              <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition">
                View
              </button>
            </div>
          </div>
        </div>

        {/* Learning Progress Chart */}
        <div className="dashboard-card">
          <h2 className="text-xl font-bold mb-4">Weekly Progress</h2>
          <canvas ref={chartRef} width="400" height="200" className="w-full h-48"></canvas>
        </div>
      </div>

      {/* Learning Insights */}
      <div className="mt-8">
        <div className="dashboard-card">
          <h2 className="text-xl font-bold mb-4">Learning Insights</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">85%</div>
              <div className="text-gray-600">Lesson Completion Rate</div>
              <div className="text-sm text-gray-500 mt-1">Above average!</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">12</div>
              <div className="text-gray-600">Day Learning Streak</div>
              <div className="text-sm text-gray-500 mt-1">Great consistency!</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">Logic</div>
              <div className="text-gray-600">Strongest Skill</div>
              <div className="text-sm text-gray-500 mt-1">Excellent problem solving!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
