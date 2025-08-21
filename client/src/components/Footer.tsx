import { useAuth } from "@/hooks/useAuth";

export function Footer() {
  const { user } = useAuth();

  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold mr-2">
                <i className="fa-solid fa-code"></i>
              </div>
              <span className="text-xl font-bold">CodewiseHub</span>
            </div>
            <p className="text-gray-300 text-sm">
              Empowering the next generation of coders through interactive and personalized learning experiences.
            </p>
          </div>

          {/* Learning */}
          <div>
            <h3 className="font-semibold mb-4">Learning</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#courses" className="hover:text-white transition">Courses</a></li>
              <li><a href="#coding-lab" className="hover:text-white transition">Coding Lab</a></li>
              <li><a href="#tutorials" className="hover:text-white transition">Tutorials</a></li>
              <li><a href="#projects" className="hover:text-white transition">Projects</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#help" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#contact" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="#community" className="hover:text-white transition">Community</a></li>
              <li><a href="#documentation" className="hover:text-white transition">Documentation</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#about" className="hover:text-white transition">About Us</a></li>
              <li><a href="#blog" className="hover:text-white transition">Blog</a></li>
              <li><a href="#careers" className="hover:text-white transition">Careers</a></li>
              <li><a href="#privacy" className="hover:text-white transition">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 CodewiseHub. All rights reserved.
            </p>
            
            {/* Admin Access - Only show in footer */}
            {user && (
              <div className="mt-4 md:mt-0">
                <a 
                  href="/admin-cms.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-gray-300 transition"
                  data-testid="link-admin-cms"
                >
                  Content Management System
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}