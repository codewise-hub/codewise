// Frontend-only authentication using localStorage
export interface AuthResponse {
  user: any;
  sessionToken: string;
}

interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: string;
  ageGroup?: string;
  packageId?: string;
  childName?: string;
  schoolName?: string;
}

const USERS_KEY = 'codewise_users';
const CURRENT_USER_KEY = 'codewise_current_user';

function getStoredUsers(): StoredUser[] {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const users = getStoredUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // In a real app, you'd verify the password hash
  // For demo purposes, we'll just check if password is provided
  if (!password) {
    throw new Error('Password is required');
  }
  
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  
  return {
    user,
    sessionToken: 'mock-session-token'
  };
}

export async function signUp(
  email: string,
  password: string,
  name: string,
  role: string,
  ageGroup?: string,
  childName?: string,
  schoolName?: string,
  packageId?: string
): Promise<AuthResponse> {
  const users = getStoredUsers();
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    throw new Error('User already exists');
  }
  
  const newUser: StoredUser = {
    id: generateId(),
    email,
    name,
    role,
    ageGroup,
    packageId,
    childName,
    schoolName
  };
  
  users.push(newUser);
  saveUsers(users);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  
  return {
    user: newUser,
    sessionToken: 'mock-session-token'
  };
}

export async function signOut(): Promise<void> {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export async function getCurrentUser(): Promise<any> {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
}