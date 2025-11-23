import React, { useState, useEffect } from 'react';
import { ViewState, CEFRLevel } from './types';
import { SERVICES, LEVELS, TESTIMONIALS } from './constants';
import { Button } from './components/Button';
import { PlacementTest } from './components/PlacementTest';
import { TestimonialCard } from './components/TestimonialCard';
import { Menu, X, Globe, MapPin, Phone, Mail, ChevronRight, Video, Users, Check, Award, CheckCircle } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | null>(null);
  const [registrationType, setRegistrationType] = useState<'ZOOM' | 'IN_PERSON'>('ZOOM');

  const handlePlacementComplete = (level: string) => {
    // Cast strict string to CEFRLevel for type safety in a real app, assuming AI returns valid enum
    if (['A1', 'A2', 'B1', 'B2'].includes(level)) {
        setSelectedLevel(level as CEFRLevel);
    }
    setView('REGISTER');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
    setView('HOME');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center cursor-pointer" onClick={() => setView('HOME')}>
              <div className="w-10 h-10 bg-french-blue rounded-full flex items-center justify-center text-white font-serif font-bold text-xl mr-3">
                F
              </div>
              <span className="font-serif text-2xl font-bold text-french-blue tracking-tight">
                French<span className="text-french-red">Cercle</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('levels')} className="text-gray-600 hover:text-french-blue font-medium transition-colors">Levels</button>
              <button onClick={() => scrollToSection('services')} className="text-gray-600 hover:text-french-blue font-medium transition-colors">Services</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-gray-600 hover:text-french-blue font-medium transition-colors">Testimonials</button>
              <Button size="sm" variant="outline" onClick={() => setView('PLACEMENT_TEST')}>Placement Test</Button>
              <Button size="sm" onClick={() => setView('REGISTER')}>Join Now</Button>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600">
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 py-4 px-4 space-y-4">
             <button onClick={() => scrollToSection('levels')} className="block w-full text-left py-2 font-medium">Levels</button>
             <button onClick={() => scrollToSection('services')} className="block w-full text-left py-2 font-medium">Services</button>
             <button onClick={() => scrollToSection('testimonials')} className="block w-full text-left py-2 font-medium">Testimonials</button>
             <div className="pt-4 flex flex-col space-y-3">
                <Button variant="outline" className="w-full" onClick={() => { setView('PLACEMENT_TEST'); setMobileMenuOpen(false); }}>Placement Test</Button>
                <Button className="w-full" onClick={() => { setView('REGISTER'); setMobileMenuOpen(false); }}>Join Now</Button>
             </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      {view === 'HOME' && (
        <>
          {/* Hero Section */}
          <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
               <img 
                 src="https://picsum.photos/id/1033/1920/1080" 
                 alt="Parisian Cafe" 
                 className="w-full h-full object-cover opacity-90"
               />
               <div className="absolute inset-0 bg-gradient-to-r from-french-blue/90 to-french-blue/40"></div>
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
              <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Master French with <span className="text-french-gold">Elegance</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-10 font-light max-w-2xl mx-auto">
                Premium language training for the ambitious. From A1 to Fluency. 
                Online via Zoom or In-Person at our center.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button size="lg" onClick={() => setView('REGISTER')}>Start Your Journey</Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-french-blue" onClick={() => setView('PLACEMENT_TEST')}>
                  Take Placement Test
                </Button>
              </div>
            </div>
          </section>

          {/* Levels Section */}
          <section id="levels" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-serif font-bold text-french-blue mb-4">The Path to Fluency</h2>
                <div className="w-24 h-1 bg-french-red mx-auto"></div>
                <p className="mt-4 text-gray-600">Structured progression following European Standards (CEFR)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {LEVELS.map((level) => (
                  <div key={level.code} className="p-6 border border-gray-100 rounded-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-slate-50 group">
                    <div className="w-16 h-16 bg-french-blue text-white rounded-full flex items-center justify-center text-xl font-bold mb-6 group-hover:bg-french-red transition-colors">
                      {level.code}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{level.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{level.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section id="services" className="py-20 bg-french-light">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                <div>
                   <h2 className="text-3xl font-serif font-bold text-french-blue mb-2">Tailored Programs</h2>
                   <p className="text-gray-600">Designed for your specific goals.</p>
                </div>
                <Button variant="outline" className="mt-4 md:mt-0" onClick={() => setView('REGISTER')}>View Schedule</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {SERVICES.map((service) => (
                  <div key={service.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                    </div>
                    <div className="p-8">
                      <h3 className="text-xl font-bold text-french-blue mb-3">{service.title}</h3>
                      <p className="text-gray-600 mb-6">{service.description}</p>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center text-sm text-gray-500">
                          <Check className="w-4 h-4 text-green-500 mr-2" /> Certified Instructors
                        </li>
                        <li className="flex items-center text-sm text-gray-500">
                          <Check className="w-4 h-4 text-green-500 mr-2" /> Flexible Timing
                        </li>
                      </ul>
                      <button 
                        onClick={() => setView('REGISTER')}
                        className="text-french-red font-semibold text-sm hover:text-french-blue transition-colors flex items-center"
                      >
                        Enroll Now <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 bg-french-blue rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between">
                <div className="mb-8 md:mb-0 md:mr-8">
                  <div className="flex items-center mb-4">
                    <Award className="w-8 h-8 text-french-gold mr-3" />
                    <h3 className="text-2xl font-bold">CPD Certification</h3>
                  </div>
                  <p className="text-blue-100 max-w-xl">
                    Our Business French courses include preparation for CPD certification, 
                    validating your professional language skills internationally.
                  </p>
                </div>
                <Button variant="secondary" onClick={() => setView('REGISTER')}>Get Certified</Button>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section id="testimonials" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-serif font-bold text-center text-french-blue mb-16">Et Voila! What Students Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {TESTIMONIALS.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} data={testimonial} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {view === 'PLACEMENT_TEST' && (
        <div className="pt-10 pb-20 animate-fade-in">
          <PlacementTest onComplete={handlePlacementComplete} />
        </div>
      )}

      {view === 'REGISTER' && (
        <div className="py-20 px-4 animate-fade-in">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-french-blue p-8 text-white text-center">
              <h2 className="text-3xl font-serif font-bold mb-2">Inscription</h2>
              <p className="text-blue-100">Begin your journey with FrenchCercle</p>
            </div>
            
            <div className="p-8">
              {selectedLevel && (
                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg mb-6 flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Placement Result: Level {selectedLevel}</p>
                    <p className="text-sm">We have pre-selected the {selectedLevel} courses for you.</p>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">Choose your learning mode</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setRegistrationType('ZOOM')}
                    className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                      registrationType === 'ZOOM' 
                        ? 'border-french-blue bg-blue-50 text-french-blue' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Video className="w-8 h-8 mb-2" />
                    <span className="font-medium">Online (Zoom)</span>
                  </button>
                  <button
                    onClick={() => setRegistrationType('IN_PERSON')}
                    className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                      registrationType === 'IN_PERSON' 
                        ? 'border-french-blue bg-blue-50 text-french-blue' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Users className="w-8 h-8 mb-2" />
                    <span className="font-medium">In Person</span>
                  </button>
                </div>
              </div>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Merci! We will contact you shortly."); setView('HOME'); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-french-blue focus:border-french-blue" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-french-blue focus:border-french-blue" required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-french-blue focus:border-french-blue" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interested Course</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-french-blue focus:border-french-blue">
                    <option>General French (A1-B2)</option>
                    <option>French for Business</option>
                    <option>French for Conversation</option>
                    <option>French for Travel</option>
                  </select>
                </div>

                <Button type="submit" className="w-full" size="lg">Complete Registration</Button>
                <p className="text-xs text-center text-gray-500 mt-4">By registering, you agree to our Terms of Service.</p>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-french-blue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="font-serif text-2xl font-bold tracking-tight mb-4">
                French<span className="text-french-red">Cercle</span>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed">
                The premier destination for American francophiles. 
                Bridging cultures through language excellence since 2024.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4 text-french-gold">Contact</h3>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> 123 Education Ave, New York, NY</li>
                <li className="flex items-center"><Phone className="w-4 h-4 mr-2" /> +1 (555) 123-4567</li>
                <li className="flex items-center"><Mail className="w-4 h-4 mr-2" /> bonjour@frenchcercle.com</li>
              </ul>
            </div>

            <div>
               <h3 className="font-bold text-lg mb-4 text-french-gold">Connect</h3>
               <div className="flex space-x-4">
                 <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-french-red transition-colors"><Globe className="w-5 h-5" /></a>
                 {/* Additional social icons would go here */}
               </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-blue-300 text-sm">
            &copy; {new Date().getFullYear()} FrenchCercle. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;