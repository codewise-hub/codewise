import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";


interface AuthModalProps {
  isOpen: boolean;
  mode: 'signin' | 'signup';
  initialRole?: string;
  initialAgeGroup?: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export function AuthModal({ isOpen, mode: initialMode, initialRole, initialAgeGroup, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: initialRole || '',
    ageGroup: initialAgeGroup || '6-11',
    childName: '',
    schoolName: '',
    packageId: ''
  });
  
  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'signin') {
        await signIn(formData.email, formData.password);
        onSuccess('Successfully signed in!');
      } else {
        await signUp(
          formData.email, 
          formData.password, 
          formData.name, 
          formData.role,
          formData.role === 'student' ? formData.ageGroup : undefined,
          formData.role === 'parent' ? formData.childName : undefined,
          formData.role === 'school_admin' ? formData.schoolName : undefined,
          (formData.role === 'student' || formData.role === 'school_admin') ? formData.packageId : undefined
        );
        onSuccess('Successfully signed up!');
      }
      onClose();
    } catch (error) {
      console.error('Auth error:', error);
      alert(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const switchMode = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setFormData({
      email: '',
      password: '',
      name: '',
      role: initialRole || '',
      ageGroup: initialAgeGroup || '6-11',
      childName: '',
      schoolName: '',
      packageId: ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{mode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            data-testid="button-close-auth"
          >
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select 
                  required 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  data-testid="select-role"
                >
                  <option value="">Select your role</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="parent">Parent</option>
                  <option value="school_admin">School Administrator</option>
                </select>
              </div>

              {formData.role === 'student' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
                  <select 
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({...formData, ageGroup: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    data-testid="select-age-group"
                  >
                    <option value="6-11">Little Coders (6-11 years)</option>
                    <option value="12-17">Teen Coders (12-17 years)</option>
                  </select>
                </div>
              )}

              {formData.role === 'parent' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Child's Name</label>
                  <input 
                    type="text" 
                    value={formData.childName}
                    onChange={(e) => setFormData({...formData, childName: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    placeholder="Enter your child's name"
                    data-testid="input-child-name"
                  />
                </div>
              )}

              {formData.role === 'school_admin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                  <input 
                    type="text" 
                    value={formData.schoolName}
                    onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    placeholder="Enter your school's name"
                    data-testid="input-school-name"
                  />
                </div>
              )}

              {(formData.role === 'student' || formData.role === 'school_admin') && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose Your Package:
                  </label>
                  <select
                    value={formData.packageId}
                    onChange={(e) => setFormData({...formData, packageId: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    data-testid="package-selector"
                    required
                  >
                    <option value="">Select a package</option>
                    {formData.role === 'school_admin' ? (
                      <>
                        <option value="school-basic">School Basic - R6999/month</option>
                        <option value="school-premium">School Premium - R17499/month</option>
                      </>
                    ) : (
                      <>
                        <option value="basic-explorer">Basic Explorer - R349/month</option>
                        <option value="pro-coder">Pro Coder - R699/month</option>
                        <option value="family-plan">Family Plan - R999/month</option>
                      </>
                    )}
                  </select>
                  
                  {formData.packageId && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        Selected: {
                          formData.packageId === 'school-basic' ? 'School Basic - R6999/month' :
                          formData.packageId === 'school-premium' ? 'School Premium - R17499/month' :
                          formData.packageId === 'basic-explorer' ? 'Basic Explorer - R349/month' :
                          formData.packageId === 'pro-coder' ? 'Pro Coder - R699/month' :
                          formData.packageId === 'family-plan' ? 'Family Plan - R999/month' : ''
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  data-testid="input-name"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              data-testid="input-email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              required 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              data-testid="input-password"
            />
          </div>

          <button 
            type="submit" 
            disabled={mode === 'signup' && (formData.role === 'student' || formData.role === 'school_admin') && !formData.packageId}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              mode === 'signin' 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : (mode === 'signup' && (formData.role === 'student' || formData.role === 'school_admin') && !formData.packageId)
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
            }`}
            data-testid={mode === 'signin' ? 'button-signin' : 'button-signup'}
          >
            {mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>



          <div className="text-center mt-4">
            <button 
              type="button" 
              onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-blue-500 hover:text-blue-600"
              data-testid="button-switch-mode"
            >
              {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}