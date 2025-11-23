import React, { useState } from 'react';
import { evaluateFrenchLevel } from '../services/geminiService';
import { PlacementResult } from '../types';
import { Button } from './Button';
import { BookOpen, Send, Loader2, CheckCircle } from 'lucide-react';

interface PlacementTestProps {
  onComplete: (level: string) => void;
}

export const PlacementTest: React.FC<PlacementTestProps> = ({ onComplete }) => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<PlacementResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif font-bold text-french-blue mb-4">AI Placement Test</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Unsure of your level? Introduce yourself in French below. Write about your hobbies, 
          your job, or why you want to learn French. Our AI will analyze your writing 
          to recommend the perfect starting point (A1-B2).
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        {/* Input Section */}
        <div className="w-full md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ecrivez votre texte ici (Write your text here):
          </label>
          <textarea
            className="w-full h-64 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-french-blue focus:border-transparent resize-none bg-french-light"
            placeholder="Bonjour, je m'appelle..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading || !!result}
          />
          <div className="mt-4 flex justify-end">
            {!result && (
              <Button onClick={handleSubmit} disabled={text.length < 10} isLoading={loading}>
                <Send className="w-4 h-4 mr-2" /> Analyze Level
              </Button>
            )}
            {result && (
               <Button variant="outline" onClick={() => { setResult(null); setText(''); }}>
                 Try Again
               </Button>
            )}
          </div>
        </div>

        {/* Result Section */}
        <div className="w-full md:w-1/2 p-8 bg-slate-50 flex flex-col justify-center items-center">
          {loading ? (
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-french-blue animate-spin mx-auto mb-4" />
              <p className="text-french-blue font-medium">Analyzing your French...</p>
            </div>
          ) : result ? (
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <span className="text-3xl font-bold text-green-700">{result.estimatedLevel}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Recommended Level</h3>
              <p className="text-gray-600 mb-6 px-4">{result.feedback}</p>
              
              <Button onClick={() => onComplete(result.estimatedLevel)} variant="secondary" className="w-full">
                Register for {result.estimatedLevel} Classes
              </Button>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Your result will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};