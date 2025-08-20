// Mock authentication for frontend-only deployment
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  ageGroup?: string;
  packageId?: string;
}

export class MockAuthService {
  private users: User[] = [];
  private currentUser: User | null = null;

  async signUp(userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    ageGroup?: string;
    packageId?: string;
    childName?: string;
    schoolName?: string;
  }): Promise<User> {
    const user: User = {
      id: Math.random().toString(36).substring(7),
      email: userData.email,
      name: userData.name,
      role: userData.role,
      ageGroup: userData.ageGroup,
      packageId: userData.packageId
    };
    
    this.users.push(user);
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return user;
  }

  signOut(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;
    
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }
    
    return null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

export const mockAuthService = new MockAuthService();