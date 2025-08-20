import { useAuth } from "@/hooks/useAuth";

interface NavigationProps {
  onAuthModalOpen: (mode: 'signin' | 'signup', role?: string, ageGroup?: string) => void;
  onCodingLabOpen: () => void;
  currentView?: 'dashboard' | 'admin';
  onViewChange?: (view: 'dashboard' | 'admin') => void;
}

export function Navigation({ onAuthModalOpen, onCodingLabOpen, currentView = 'dashboard', onViewChange }: NavigationProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                <i className="fa-solid fa-code"></i>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800">CodewiseHub</span>
            </div>
          </div>
          
          {!user ? (
            <div className="flex items-center space-x-4">
              <a href="#home" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">Home</a>
              <a href="#courses" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">Courses</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium">Pricing</a>
              <button 
                onClick={() => onAuthModalOpen('signup')} 
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                <i className="fa-solid fa-rocket mr-2"></i>Sign Up Free
              </button>
              <button 
                onClick={() => onAuthModalOpen('signin')} 
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Sign In
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              {user.role === 'student' && (
                <button 
                  onClick={onCodingLabOpen}
                  className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition"
                >
                  <i className="fa-solid fa-laptop-code mr-2"></i>Coding Lab
                </button>
              )}
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <span>{user.name}</span>
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                  <button 
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
