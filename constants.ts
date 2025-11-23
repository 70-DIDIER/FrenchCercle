import { Service, Testimonial } from './types';

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