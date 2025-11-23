import React from 'react';
import { Testimonial } from '../types';
import { Star, Quote } from 'lucide-react';

interface TestimonialCardProps {
  data: Testimonial;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 relative group hover:shadow-md transition-shadow">
      <Quote className="absolute top-4 right-4 text-french-blue/10 w-8 h-8 group-hover:text-french-blue/20 transition-colors" />
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < data.rating ? 'text-french-gold fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <p className="text-gray-600 italic mb-6">"{data.content}"</p>
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-french-blue text-white flex items-center justify-center font-bold text-sm mr-3">
          {data.name.charAt(0)}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">{data.name}</h4>
          <p className="text-xs text-gray-500 uppercase tracking-wider">{data.role}</p>
        </div>
      </div>
    </div>
  );
};