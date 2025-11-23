import React, { useState, useEffect } from 'react';
import { ViewState, CEFRLevel } from './types';
import { SERVICES, LEVELS, TESTIMONIALS, TEAM } from './constants';
import { Button } from './components/Button';
import { PlacementTest } from './components/PlacementTest';
import { TestimonialCard } from './components/TestimonialCard';
import { Menu, X, Globe, MapPin, Phone, Mail, ChevronRight, Video, Users, Check, Award, CheckCircle, GraduationCap } from 'lucide-react';

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
    if (view !== 'HOME') {
      setView('HOME');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center cursor-pointer" onClick={() => setView('HOME')}>
              <div className="w-10 h-10 bg-french-blue rounded-full flex items-center justify-center text-white font-serif font-bold text-xl mr-3 shadow-md">
                F
              </div>
              <span className="font-serif text-2xl font-bold text-french-blue tracking-tight">
                French<span className="text-french-red">Cercle</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => setView('ABOUT')} className={`font-medium transition-colors ${view === 'ABOUT' ? 'text-french-blue font-bold' : 'text-gray-600 hover:text-french-blue'}`}>About</button>
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
          <div className="md:hidden bg-white border-b border-gray-100 py-4 px-4 space-y-4 shadow-lg">
             <button onClick={() => { setView('ABOUT'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 font-medium">About</button>
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
          <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
               {/* Updated image to show students in class */}
               <img 
                 src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80" 
                 alt="Students learning in a classroom" 
                 className="w-full h-full object-cover"
               />
               {/* Lighter gradient for better visibility */}
               <div className="absolute inset-0 bg-gradient-to-r from-french-blue/80 to-french-blue/20 mix-blend-multiply"></div>
               <div className="absolute inset-0 bg-black/10"></div>
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
              <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-semibold mb-6 tracking-wide uppercase">
                Premier French Institute
              </span>
              <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-lg">
                Master French with <span className="text-french-gold italic">Confidence</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-50 mb-10 font-light max-w-2xl mx-auto drop-shadow-md">
                Premium language training for the ambitious. From A1 to Fluency. 
                Online via Zoom or In-Person at our center.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button size="lg" onClick={() => setView('REGISTER')} className="shadow-lg shadow-blue-900/50">Start Your Journey</Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-french-blue backdrop-blur-sm" onClick={() => setView('PLACEMENT_TEST')}>
                  Take Placement Test
                </Button>
              </div>
            </div>
          </section>

          {/* Levels Section */}
          <section id="levels" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-serif font-bold text-french-blue mb-4">The Path to Fluency</h2>
                <div className="w-24 h-1.5 bg-french-red mx-auto rounded-full"></div>
                <p className="mt-6 text-lg text-gray-600">Structured progression following European Standards (CEFR)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {LEVELS.map((level) => (
                  <div key={level.code} className="p-8 border border-gray-100 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-slate-50 group">
                    <div className="w-16 h-16 bg-french-blue text-white rounded-2xl rotate-3 group-hover:rotate-6 flex items-center justify-center text-xl font-bold mb-6 group-hover:bg-french-red transition-all shadow-lg">
                      {level.code}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">{level.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{level.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section id="services" className="py-24 bg-french-light">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                <div>
                   <h2 className="text-4xl font-serif font-bold text-french-blue mb-3">Tailored Programs</h2>
                   <p className="text-xl text-gray-600">Designed for your specific goals.</p>
                </div>
                <Button variant="outline" className="mt-6 md:mt-0" onClick={() => setView('REGISTER')}>View Schedule</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {SERVICES.map((service) => (
                  <div key={service.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group">
                    <div className="h-56 overflow-hidden relative">
                      <div className="absolute inset-0 bg-french-blue/20 group-hover:bg-transparent transition-colors z-10"></div>
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-french-blue mb-3">{service.title}</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                      <ul className="space-y-3 mb-8">
                        <li className="flex items-center text-sm text-gray-600">
                          <Check className="w-5 h-5 text-green-500 mr-3" /> Certified Instructors
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <Check className="w-5 h-5 text-green-500 mr-3" /> Flexible Timing
                        </li>
                      </ul>
                      <button 
                        onClick={() => setView('REGISTER')}
                        className="text-french-red font-bold text-sm hover:text-french-blue transition-colors flex items-center uppercase tracking-wide"
                      >
                        Enroll Now <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-20 bg-french-blue rounded-3xl p-8 md:p-16 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-french-red/20 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 mb-8 md:mb-0 md:mr-12">
                  <div className="flex items-center mb-6">
                    <Award className="w-10 h-10 text-french-gold mr-4" />
                    <h3 className="text-3xl font-bold">CPD Certification</h3>
                  </div>
                  <p className="text-blue-100 max-w-xl text-lg leading-relaxed">
                    Our Business French courses include preparation for CPD certification, 
                    validating your professional language skills internationally.
                  </p>
                </div>
                <div className="relative z-10">
                    <Button variant="secondary" size="lg" onClick={() => setView('REGISTER')}>Get Certified</Button>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section id="testimonials" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-4xl font-serif font-bold text-center text-french-blue mb-16">Et Voila! What Students Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {TESTIMONIALS.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} data={testimonial} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* About View */}
      {view === 'ABOUT' && (
        <div className="animate-fade-in">
            <div className="bg-french-blue text-white py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">Our Team</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Meet the passionate educators bringing French excellence to you.
                    </p>
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {TEAM.map((member) => (
                        <div key={member.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col hover:shadow-2xl transition-shadow duration-300">
                            <div className="h-80 overflow-hidden">
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                            </div>
                            <div className="p-8 flex-1 flex flex-col">
                                <h3 className="text-2xl font-serif font-bold text-french-blue mb-1">{member.name}</h3>
                                <p className="text-french-red font-medium text-sm uppercase tracking-wide mb-4">{member.role}</p>
                                <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <h3 className="text-2xl font-serif font-bold text-gray-800 mb-6">Ready to learn with us?</h3>
                    <Button size="lg" onClick={() => setView('REGISTER')}>Join the Class</Button>
                </div>
            </div>
        </div>
      )}

      {view === 'PLACEMENT_TEST' && (
        <div className="pt-10 pb-20 animate-fade-in bg-slate-50">
          <PlacementTest onComplete={handlePlacementComplete} />
        </div>
      )}

      {view === 'REGISTER' && (
        <div className="py-20 px-4 animate-fade-in bg-slate-50">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-french-blue p-10 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-serif font-bold mb-3">Inscription</h2>
                <p className="text-blue-100">Begin your journey with FrenchCercle</p>
              </div>
            </div>
            
            <div className="p-8 md:p-12">
              {selectedLevel && (
                <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-xl mb-8 flex items-start shadow-sm">
                  <CheckCircle className="w-6 h-6 mr-4 mt-0.5 flex-shrink-0 text-green-600" />
                  <div>
                    <p className="font-bold text-lg mb-1">Placement Result: Level {selectedLevel}</p>
                    <p className="text-green-700">We have pre-selected the {selectedLevel} courses for you based on your evaluation.</p>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Choose your learning mode</label>
                <div className="grid grid-cols-2 gap-6">
                  <button
                    onClick={() => setRegistrationType('ZOOM')}
                    className={`p-6 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-200 ${
                      registrationType === 'ZOOM' 
                        ? 'border-french-blue bg-blue-50/50 text-french-blue shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-white'
                    }`}
                  >
                    <Video className="w-10 h-10 mb-3" />
                    <span className="font-bold">Online (Zoom)</span>
                  </button>
                  <button
                    onClick={() => setRegistrationType('IN_PERSON')}
                    className={`p-6 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-200 ${
                      registrationType === 'IN_PERSON' 
                        ? 'border-french-blue bg-blue-50/50 text-french-blue shadow-md' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-white'
                    }`}
                  >
                    <Users className="w-10 h-10 mb-3" />
                    <span className="font-bold">In Person</span>
                  </button>
                </div>
              </div>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Merci! We will contact you shortly."); setView('HOME'); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-french-blue focus:border-transparent transition-shadow" required placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input type="text" className="w-full px-4 py-3 border border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-french-blue focus:border-transparent transition-shadow" required placeholder="Doe" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 border border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-french-blue focus:border-transparent transition-shadow" required placeholder="john@example.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interested Course</label>
                  <div className="relative">
                    <select className="w-full px-4 py-3 border border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-french-blue focus:border-transparent appearance-none transition-shadow">
                        <option>General French (A1-B2)</option>
                        <option>French for Business</option>
                        <option>French for Conversation</option>
                        <option>French for Travel</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                        <ChevronRight className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full text-lg h-14 shadow-xl shadow-blue-900/10 mt-4" size="lg">Complete Registration</Button>
                <p className="text-xs text-center text-gray-400 mt-6">By registering, you agree to our Terms of Service & Privacy Policy.</p>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-french-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center mb-6">
                 <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-french-blue font-serif font-bold text-lg mr-3">
                    F
                 </div>
                 <span className="font-serif text-2xl font-bold tracking-tight">
                    French<span className="text-french-red">Cercle</span>
                 </span>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
                The premier destination for American francophiles. 
                Bridging cultures through language excellence since 2024.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-6 text-french-gold font-serif">Contact Us</h3>
              <ul className="space-y-4 text-blue-100">
                <li className="flex items-start group">
                    <MapPin className="w-5 h-5 mr-3 mt-0.5 group-hover:text-french-red transition-colors" /> 
                    <span>123 Education Ave,<br/>New York, NY 10001</span>
                </li>
                <li className="flex items-center group">
                    <Phone className="w-5 h-5 mr-3 group-hover:text-french-red transition-colors" /> 
                    <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center group">
                    <Mail className="w-5 h-5 mr-3 group-hover:text-french-red transition-colors" /> 
                    <span>bonjour@frenchcercle.com</span>
                </li>
              </ul>
            </div>

            <div>
               <h3 className="font-bold text-lg mb-6 text-french-gold font-serif">Social</h3>
               <div className="flex space-x-4">
                 <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-french-red transition-all duration-300 hover:-translate-y-1"><Globe className="w-5 h-5" /></a>
                 <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-french-red transition-all duration-300 hover:-translate-y-1"><Users className="w-5 h-5" /></a>
               </div>
               <div className="mt-8">
                   <p className="text-blue-300 text-sm mb-2">Subscribe to our newsletter</p>
                   <div className="flex">
                       <input type="email" placeholder="Email" className="bg-blue-900/50 border-none rounded-l-md px-4 py-2 w-full text-sm text-white focus:ring-1 focus:ring-french-gold" />
                       <button className="bg-french-gold text-french-blue px-4 py-2 rounded-r-md text-sm font-bold hover:bg-white transition-colors">OK</button>
                   </div>
               </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-blue-300 text-sm flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} FrenchCercle. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;