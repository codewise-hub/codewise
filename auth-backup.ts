// Complete client/src/lib/auth.ts file contents for reference
import type { User } from '@shared/schema';

export interface AuthResponse {
  user: User;
  sessionToken: string;
}

const API_BASE = '/api/auth';

// Sign up user
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
  const data = {
    email,
    password,
    name,
    role,
    ageGroup,
    childName,
    schoolName,
    packageId
  };
  const response = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include', // Include cookies
  });

  if (!response.ok) {
    let errorMessage = 'Sign up failed';
    try {
      const error = await response.json();
      errorMessage = error.error || error.message || 'Sign up failed';
    } catch (parseError) {
      // If response is not JSON, use the response text
      const errorText = await response.text();
      errorMessage = errorText || `Server error (${response.status})`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Sign in user
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // Include cookies
  });

  if (!response.ok) {
    let errorMessage = 'Sign in failed';
    try {
      const error = await response.json();
      errorMessage = error.error || error.message || 'Sign in failed';
    } catch (parseError) {
      // If response is not JSON, use the response text
      const errorText = await response.text();
      errorMessage = errorText || `Server error (${response.status})`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Sign out user
export async function signOut(): Promise<void> {
  const response = await fetch(`${API_BASE}/signout`, {
    method: 'POST',
    credentials: 'include', // Include cookies
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Sign out failed');
  }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE}/me`, {
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}