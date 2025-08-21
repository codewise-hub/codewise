export type UserRole = 'student' | 'teacher' | 'parent' | 'school_admin';
export type AgeGroup = '6-11' | '12-17';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  ageGroup?: AgeGroup;
  childName?: string;
  schoolId?: string;
  schoolName?: string;
}

export interface UserProgress {
  lessonsCompleted: number;
  projectsCompleted: number;
  totalScore: number;
  level: number;
}

export interface Achievement {
  id: string;
  badgeType: string;
  title: string;
  description: string;
  earnedAt: string;
}
