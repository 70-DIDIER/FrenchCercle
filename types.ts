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

export interface PlacementResult {
  estimatedLevel: CEFRLevel;
  feedback: string;
  confidence: number;
}

export type ViewState = 'HOME' | 'PLACEMENT_TEST' | 'REGISTER';
