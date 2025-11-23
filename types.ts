export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface PlacementResult {
  estimatedLevel: CEFRLevel;
  feedback: string;
  confidence: number;
}

export interface Registrant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  courseInterest: string;
  level: string;
  type: 'ZOOM' | 'IN_PERSON';
  status: 'PENDING' | 'CONTACTED' | 'ENROLLED';
  date: string;
}

export type ViewState = 'HOME' | 'PLACEMENT_TEST' | 'REGISTER' | 'ABOUT' | 'ADMIN';