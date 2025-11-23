import { Service, Testimonial, TeamMember } from './types';

export const SERVICES: Service[] = [
  {
    id: 'conversation',
    title: 'French for Conversation',
    description: 'Master the art of fluidity. Focus on pronunciation, slang, and cultural nuances to speak like a local.',
    icon: 'MessageCircle',
    image: 'https://picsum.photos/id/1015/800/600'
  },
  {
    id: 'business',
    title: 'French for Business',
    description: 'Professional vocabulary, etiquette, and formal writing for the corporate world. Prepare for CPD certification.',
    icon: 'Briefcase',
    image: 'https://picsum.photos/id/1076/800/600'
  },
  {
    id: 'travel',
    title: 'French for Travel',
    description: 'Essential phrases and cultural tips for your next trip to Paris, Provence, or Quebec.',
    icon: 'Map',
    image: 'https://picsum.photos/id/1036/800/600'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    role: 'Marketing Director',
    content: 'FrenchCercle helped me secure a partnership with a Parisian firm. The Business French course is world-class.',
    rating: 5
  },
  {
    id: '2',
    name: 'Michael Ross',
    role: 'Travel Enthusiast',
    content: 'The online Zoom classes were incredibly convenient. I went from A1 to B1 in just 6 months.',
    rating: 5
  },
  {
    id: '3',
    name: 'Elodie Martin',
    role: 'Student',
    content: 'The placement test was spot on. The teachers are native speakers and very patient. Highly recommended!',
    rating: 4
  }
];

export const LEVELS = [
  {
    code: 'A1',
    title: 'Beginner',
    desc: 'Can understand and use familiar everyday expressions and very basic phrases.'
  },
  {
    code: 'A2',
    title: 'Elementary',
    desc: 'Can understand sentences and frequently used expressions related to areas of most immediate relevance.'
  },
  {
    code: 'B1',
    title: 'Intermediate',
    desc: 'Can deal with most situations likely to arise whilst travelling in an area where the language is spoken.'
  },
  {
    code: 'B2',
    title: 'Upper Intermediate',
    desc: 'Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible.'
  }
];

export const TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Clémence Dubois',
    role: 'Director & Lead Instructor',
    bio: 'With over 15 years of experience teaching French to diplomats and executives, Clémence founded FrenchCercle to bring a touch of Parisian excellence to American students.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    name: 'Jean-Pierre Laurent',
    role: 'Business French Specialist',
    bio: 'Former corporate trainer in La Défense, Jean-Pierre specializes in preparing professionals for the global market and CPD certifications.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    name: 'Sophie Moreau',
    role: 'Cultural Liaison & Conversation',
    bio: 'Sophie brings language to life through cinema, literature, and art history, making every conversation class an immersive cultural journey.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];