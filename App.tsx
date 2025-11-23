import React, { useState, useEffect } from 'react';
import { ViewState, CEFRLevel, Registrant } from './types';
import { SERVICES, LEVELS, TESTIMONIALS, TEAM, MOCK_REGISTRANTS } from './constants';
import { Button } from './components/Button';
import { PlacementTest } from './components/PlacementTest';
import { TestimonialCard } from './components/TestimonialCard';
import { fetchRegistrants, addRegistrantToDb, isSupabaseConfigured, signInAdmin, signOutAdmin, getCurrentUser } from './services/supabaseClient';
import { Menu, X, Globe, MapPin, Phone, Mail, ChevronRight, Video, Users, Check, Award, CheckCircle, GraduationCap, Lock, Search, Filter, MoreHorizontal, AlertCircle, Download, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | null>(null);
  const [registrationType, setRegistrationType] = useState<'ZOOM' | 'IN_PERSON'>('ZOOM');
  
  // Data State
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Initial Data Load & Auth Check
  const loadData = async () => {
    setIsLoadingData(true);
    if (isSupabaseConfigured()) {
      try {
        const data = await fetchRegistrants();
        setRegistrants(data);
      } catch (error) {
        console.error("Failed to load real data, using mock", error);
        setRegistrants(MOCK_REGISTRANTS);
      }
    } else {
       // Fallback for demo if no API keys
       const savedData = localStorage.getItem('frenchcercle_data');
       setRegistrants(savedData ? JSON.parse(savedData) : MOCK_REGISTRANTS);
    }
    setIsLoadingData(false);
  };

  useEffect(() => {
    const checkUser = async () => {
      if (isSupabaseConfigured()) {
        const user = await getCurrentUser();
        if (user) {
          setIsAdminAuthenticated(true);
          loadData();
        }
      }
    };
    checkUser();
  }, []);

  const handlePlacementComplete = (level: string) => {
    if (['A1', 'A2', 'B1', 'B2'].includes(level)) {
        setSelectedLevel(level as CEFRLevel);
    }
    setView('REGISTER');
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    if (isSupabaseConfigured()) {
      try {
        await signInAdmin(adminEmail, adminPassword);
        setIsAdminAuthenticated(true);
        loadData();
      } catch (error: any) {
        setLoginError(error.message || 'Authentication failed');
      } finally {
        setIsLoggingIn(false);
      }
    } else {
      // Fallback local pour démo sans Supabase
      if (adminPassword === 'admin123') {
        setIsAdminAuthenticated(true);
        loadData();
      } else {
        setLoginError('Incorrect Password (Demo Mode: admin123)');
      }
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogout = async () => {
    await signOutAdmin();
    setIsAdminAuthenticated(false);
    setAdminEmail('');
    setAdminPassword('');
    setView('HOME');
  };

  const handleExportExcel = () => {
    // Define headers
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Course', 'Level', 'Type', 'Status', 'Date'];
    
    // Map data to CSV format
    const csvData = registrants.map(r => [
      r.id,
      `"${r.firstName}"`, // Quote strings to handle commas inside
      `"${r.lastName}"`,
      r.email,
      `"${r.courseInterest}"`,
      r.level,
      r.type,
      r.status,
      r.date
    ]);

    // Combine headers and rows
    const csvContent = [
        headers.join(','), 
        ...csvData.map(row => row.join(','))
    ].join('\n');

    // Add BOM for Excel to recognize UTF-8 (essential for French accents)
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `frenchcercle_registrants_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Real Registration
  const handleRegistrationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const partialRegistrant = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      courseInterest: formData.get('courseInterest') as string,
      level: (formData.get('level') as string) || 'A1',
      type: registrationType,
      date: new Date().toISOString().split('T')[0]
    };

    try {
      if (isSupabaseConfigured()) {
         const newRegistrant = await addRegistrantToDb(partialRegistrant);
         if (newRegistrant) {
            setRegistrants(prev => [newRegistrant, ...prev]);
         }
      } else {
        // Fallback to LocalStorage for demo purposes if no Supabase Key
        const newMockRegistrant: Registrant = {
            ...partialRegistrant,
            id: Date.now().toString(),
            status: 'PENDING'
        };
        const updatedList = [newMockRegistrant, ...registrants];
        setRegistrants(updatedList);
        localStorage.setItem('frenchcercle_data', JSON.stringify(updatedList));
      }
      
      alert(`Félicitations ${partialRegistrant.firstName}! Your application has been received. We will contact you at ${partialRegistrant.email} shortly.`);
      setView('HOME');

    } catch (error) {
      console.error(error);
      alert("There was an error submitting your registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
               <img 
                 src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80" 
                 alt="Students learning in a classroom" 
                 className="w-full h-full object-cover"
               />
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
                    type="button"
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
                    type="button"
                  >
                    <Users className="w-10 h-10 mb-3" />
                    <span className="font-bold">In Person</span>
                  </button>
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleRegistrationSubmit}>
                {/* Hidden input to pass the selected level or default to A1 */}
                <input type="hidden" name="level" value={selectedLevel || 'A1'} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input name="firstName" type="text" className="w-full px-4 py-3 border border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-french-blue focus:border-transparent transition-shadow" required placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input name="lastName" type="text" className="w-full px-4 py-3 border border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-french-blue focus:border-transparent transition-shadow" required placeholder="Doe" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input name="email" type="email" className="w-full px-4 py-3 border border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-french-blue focus:border-transparent transition-shadow" required placeholder="john@example.com" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interested Course</label>
                  <div className="relative">
                    <select name="courseInterest" className="w-full px-4 py-3 border border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-french-blue focus:border-transparent appearance-none transition-shadow">
                        <option value="General French">General French (A1-B2)</option>
                        <option value="French for Business">French for Business</option>
                        <option value="French for Conversation">French for Conversation</option>
                        <option value="French for Travel">French for Travel</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                        <ChevronRight className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full text-lg h-14 shadow-xl shadow-blue-900/10 mt-4" size="lg" isLoading={isSubmitting}>Complete Registration</Button>
                <p className="text-xs text-center text-gray-400 mt-6">By registering, you agree to our Terms of Service & Privacy Policy.</p>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Admin View */}
      {view === 'ADMIN' && (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
          {!isAdminAuthenticated ? (
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md animate-fade-in border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-french-blue rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Admin Portal</h2>
                <p className="text-gray-500 text-sm">Restricted access for FrenchCercle staff</p>
                {!isSupabaseConfigured() && (
                    <div className="mt-4 p-3 bg-amber-50 text-amber-700 text-xs rounded-lg border border-amber-200 text-left">
                        <AlertCircle className="w-4 h-4 inline mr-1 mb-0.5" />
                        <strong>Demo Mode:</strong> Supabase keys not detected. Data is saved locally in browser.
                    </div>
                )}
                {loginError && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 text-left">
                        <AlertCircle className="w-4 h-4 inline mr-1 mb-0.5" />
                        {loginError}
                    </div>
                )}
              </div>
              <form onSubmit={handleAdminLogin}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-french-blue focus:border-transparent"
                    placeholder="admin@frenchcercle.com"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input 
                    type="password" 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-french-blue focus:border-transparent"
                    placeholder="Enter password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" isLoading={isLoggingIn}>Login Securely</Button>
                <button type="button" onClick={() => setView('HOME')} className="w-full mt-4 text-sm text-gray-500 hover:text-french-blue">Return Home</button>
              </form>
            </div>
          ) : (
            <div className="w-full max-w-6xl animate-fade-in h-[85vh] flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-serif font-bold text-french-blue">Dashboard</h2>
                  <p className="text-gray-600">Overview of student registrations</p>
                </div>
                <div className="flex space-x-3">
                   <Button variant="outline" onClick={handleAdminLogout} className="flex items-center gap-2">
                     <LogOut className="w-4 h-4" /> Logout
                   </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-blue-50 rounded-lg"><Users className="w-6 h-6 text-french-blue" /></div>
                      <span className="text-green-600 text-xs font-bold">Live Data</span>
                   </div>
                   <h3 className="text-3xl font-bold text-gray-900">{registrants.length}</h3>
                   <p className="text-sm text-gray-500">Total Students</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-purple-50 rounded-lg"><Video className="w-6 h-6 text-purple-600" /></div>
                   </div>
                   <h3 className="text-3xl font-bold text-gray-900">{registrants.filter(r => r.type === 'ZOOM').length}</h3>
                   <p className="text-sm text-gray-500">Online Learners</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-orange-50 rounded-lg"><GraduationCap className="w-6 h-6 text-orange-600" /></div>
                   </div>
                   <h3 className="text-3xl font-bold text-gray-900">{registrants.filter(r => r.status === 'ENROLLED').length}</h3>
                   <p className="text-sm text-gray-500">Active Enrollments</p>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-red-50 rounded-lg"><Mail className="w-6 h-6 text-french-red" /></div>
                   </div>
                   <h3 className="text-3xl font-bold text-gray-900">{registrants.filter(r => r.status === 'PENDING').length}</h3>
                   <p className="text-sm text-gray-500">Pending Actions</p>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50">
                   <div className="relative w-full md:w-auto">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" placeholder="Search students..." className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-french-blue" />
                   </div>
                   <div className="flex space-x-2 w-full md:w-auto justify-end">
                      <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                         <Filter className="w-4 h-4 mr-2" /> Filter
                      </button>
                      <Button onClick={handleExportExcel} variant="secondary" className="flex items-center gap-2" size="sm">
                         <Download className="w-4 h-4" /> Export Excel
                      </Button>
                   </div>
                </div>
                <div className="overflow-auto relative">
                  {isLoadingData && (
                     <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-french-blue"></div>
                     </div>
                  )}
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold sticky top-0">
                      <tr>
                        <th className="px-6 py-4">Student Name</th>
                        <th className="px-6 py-4">Course</th>
                        <th className="px-6 py-4">Level</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {registrants.length === 0 && !isLoadingData ? (
                          <tr><td colSpan={7} className="text-center py-10 text-gray-500">No registrations found.</td></tr>
                      ) : (
                        registrants.map((student) => (
                            <tr key={student.id} className="hover:bg-blue-50/30 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-french-blue/10 text-french-blue flex items-center justify-center font-bold text-xs mr-3">
                                    {student.firstName[0]}{student.lastName[0]}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">{student.firstName} {student.lastName}</div>
                                    <div className="text-xs text-gray-500">{student.email}</div>
                                </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">{student.courseInterest}</td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {student.level}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center text-xs font-medium ${student.type === 'ZOOM' ? 'text-blue-600' : 'text-purple-600'}`}>
                                {student.type === 'ZOOM' ? <Video className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
                                {student.type === 'ZOOM' ? 'Online' : 'In-Person'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                student.status === 'ENROLLED' ? 'bg-green-50 text-green-700 border-green-200' : 
                                student.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                                'bg-blue-50 text-blue-700 border-blue-200'
                                }`}>
                                {student.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{student.date}</td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-gray-400 hover:text-french-blue"><MoreHorizontal className="w-5 h-5" /></button>
                            </td>
                            </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      {!isAdminAuthenticated && view !== 'ADMIN' && (
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
              <div className="flex space-x-6 mt-4 md:mt-0 items-center">
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                  <button onClick={() => setView('ADMIN')} className="hover:text-white transition-colors flex items-center text-blue-400/50 hover:text-blue-200">
                    <Lock className="w-3 h-3 mr-1" /> Admin Access
                  </button>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;