import React, { useState } from 'react';
import { evaluateFrenchLevel } from '../services/geminiService';
import { PlacementResult } from '../types';
import { Button } from './Button';
import { BookOpen, Send, Loader2, RefreshCw, PenTool } from 'lucide-react';

interface PlacementTestProps {
  onComplete: (level: string) => void;
}

export const PlacementTest: React.FC<PlacementTestProps> = ({ onComplete }) => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<PlacementResult | null>(null);
  const [loading, setLoading] = useState(false);
  const minChars = 30;

  const handleSubmit = async () => {
    if (text.length < minChars) return;
    setLoading(true);
    try {
      const evaluation = await evaluateFrenchLevel(text);
      setResult(evaluation);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif font-bold text-french-blue mb-4">AI Placement Assessment</h2>
        <div className="w-16 h-1 bg-french-red mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
          At FrenchCercle, we ensure you start at exactly the right level. 
          Please write a short introduction in French (5-10 sentences). 
          Tell us about yourself, your hobbies, or why you want to learn French.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row min-h-[500px]">
        {/* Input Section */}
        <div className="w-full lg:w-1/2 p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-gray-100 bg-slate-50 flex flex-col">
          <div className="flex items-center mb-4 text-french-blue font-semibold">
            <PenTool className="w-5 h-5 mr-2" />
            <span>Votre Texte (Your Text)</span>
          </div>
          
          <div className="relative flex-grow">
            <textarea
              className="w-full h-full min-h-[250px] p-6 border border-gray-200 rounded-xl focus:ring-2 focus:ring-french-blue focus:border-transparent resize-none bg-white text-gray-700 leading-relaxed shadow-inner transition-all"
              placeholder="Bonjour, je m'appelle... J'aime voyager et..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading || !!result}
            />
            <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-md backdrop-blur-sm">
              {text.length} chars
            </div>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
             <span className={`text-xs font-medium transition-colors ${text.length < minChars ? 'text-french-red' : 'text-green-600'}`}>
               {text.length < minChars ? `Please write at least ${minChars} characters` : 'Ready to submit'}
             </span>
            {!result && (
              <Button onClick={handleSubmit} disabled={text.length < minChars} isLoading={loading} className="shadow-lg shadow-blue-900/10">
                <Send className="w-4 h-4 mr-2" /> Analyze My French
              </Button>
            )}
            {result && (
               <Button variant="outline" onClick={() => { setResult(null); setText(''); }}>
                 <RefreshCw className="w-4 h-4 mr-2" /> Try Again
               </Button>
            )}
          </div>
        </div>

        {/* Result Section */}
        <div className="w-full lg:w-1/2 p-8 lg:p-10 bg-white flex flex-col justify-center items-center relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -ml-16 -mb-16 opacity-50 pointer-events-none"></div>

          {loading ? (
            <div className="text-center relative z-10">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-french-light border-t-french-blue rounded-full animate-spin mx-auto mb-6"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl">🇫🇷</span>
                </div>
              </div>
              <h3 className="text-xl font-serif font-bold text-french-blue mb-2">Analyzing...</h3>
              <p className="text-gray-500">Our Director of Studies is reviewing your text.</p>
            </div>
          ) : result ? (
            <div className="text-center animate-fade-in relative z-10 w-full max-w-md">
              <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-800 text-xs font-bold tracking-wider uppercase mb-6">
                Assessment Complete
              </span>
              
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-french-blue to-blue-800 flex items-center justify-center text-white shadow-xl ring-4 ring-blue-50">
                    <span className="text-4xl font-serif font-bold">{result.estimatedLevel}</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-md">
                     <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">Recommended Level: {result.estimatedLevel}</h3>
              <div className="bg-slate-50 p-6 rounded-xl border border-gray-100 mb-8 text-left">
                <p className="text-gray-600 italic text-sm leading-relaxed">"{result.feedback}"</p>
                <div className="mt-4 flex items-center justify-end">
                   <span className="text-xs text-french-blue font-bold">- FrenchCercle AI Director</span>
                </div>
              </div>
              
              <Button onClick={() => onComplete(result.estimatedLevel)} size="lg" className="w-full shadow-xl shadow-blue-900/20">
                Continue to Registration
              </Button>
            </div>
          ) : (
            <div className="text-center text-gray-400 relative z-10">
              <BookOpen className="w-20 h-20 mx-auto mb-6 opacity-20" />
              <p className="text-lg font-light">Your personalized assessment results<br/>will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};