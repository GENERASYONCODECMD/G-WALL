import React, { useState, useEffect } from 'react';
import { MatchItem } from '../../types';
import { RefreshCcw } from 'lucide-react';

interface MatchGameProps {
  items: MatchItem[];
  onReset: () => void;
}

const MatchGame: React.FC<MatchGameProps> = ({ items, onReset }) => {
  const [shuffledTerms, setShuffledTerms] = useState<MatchItem[]>([]);
  const [shuffledDefs, setShuffledDefs] = useState<MatchItem[]>([]);
  
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedDef, setSelectedDef] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Shuffle arrays independently
    setShuffledTerms([...items].sort(() => Math.random() - 0.5));
    setShuffledDefs([...items].sort(() => Math.random() - 0.5));
  }, [items]);

  const handleTermClick = (id: string) => {
    if (matchedIds.has(id)) return;
    
    if (selectedDef) {
        // Attempt match
        if (selectedDef === id) {
            setMatchedIds(prev => new Set(prev).add(id));
            setSelectedDef(null);
            setSelectedTerm(null);
        } else {
            // Mismatch
            setSelectedTerm(id); // Switch selection or flash error (simplified here)
            setTimeout(() => {
                 setSelectedTerm(null);
                 setSelectedDef(null);
            }, 500);
        }
    } else {
        setSelectedTerm(id === selectedTerm ? null : id);
    }
  };

  const handleDefClick = (id: string) => {
    if (matchedIds.has(id)) return;

    if (selectedTerm) {
        // Attempt match
        if (selectedTerm === id) {
            setMatchedIds(prev => new Set(prev).add(id));
            setSelectedTerm(null);
            setSelectedDef(null);
        } else {
            // Mismatch
            setSelectedDef(id); 
            setTimeout(() => {
                setSelectedTerm(null);
                setSelectedDef(null);
           }, 500);
        }
    } else {
        setSelectedDef(id === selectedDef ? null : id);
    }
  };

  const isComplete = matchedIds.size === items.length;

  if (isComplete) {
    return (
        <div className="glass-panel p-10 rounded-3xl text-center max-w-2xl mx-auto animate-fade-in">
          <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
            Harika Eşleşme!
          </h2>
          <p className="text-zinc-400 mb-8 text-lg">Tüm kartları doğru eşleştirdin.</p>
          <button 
            onClick={onReset}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCcw size={20} /> Tekrar Oyna
          </button>
        </div>
      );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-2 gap-8 md:gap-16">
        
        {/* Terms Column */}
        <div className="space-y-4">
            <h3 className="text-center text-zinc-500 font-bold mb-4 uppercase tracking-wider text-xs">Kavramlar</h3>
            {shuffledTerms.map((item) => {
                const isMatched = matchedIds.has(item.id);
                const isSelected = selectedTerm === item.id;
                
                return (
                    <button
                        key={`term-${item.id}`}
                        onClick={() => handleTermClick(item.id)}
                        disabled={isMatched}
                        className={`
                            w-full p-4 rounded-xl border-2 transition-all duration-300 text-sm md:text-base font-medium
                            ${isMatched 
                                ? 'bg-transparent border-transparent text-zinc-600 opacity-20' 
                                : isSelected 
                                    ? 'bg-indigo-600 border-indigo-500 text-white scale-105 shadow-lg shadow-indigo-500/20' 
                                    : 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800'
                            }
                        `}
                    >
                        {item.term}
                    </button>
                )
            })}
        </div>

        {/* Definitions Column */}
        <div className="space-y-4">
            <h3 className="text-center text-zinc-500 font-bold mb-4 uppercase tracking-wider text-xs">Tanımlar</h3>
            {shuffledDefs.map((item) => {
                const isMatched = matchedIds.has(item.id);
                const isSelected = selectedDef === item.id;

                return (
                    <button
                        key={`def-${item.id}`}
                        onClick={() => handleDefClick(item.id)}
                        disabled={isMatched}
                        className={`
                            w-full p-4 rounded-xl border-2 transition-all duration-300 text-sm md:text-base font-medium
                            ${isMatched 
                                ? 'bg-transparent border-transparent text-zinc-600 opacity-20' 
                                : isSelected 
                                    ? 'bg-purple-600 border-purple-500 text-white scale-105 shadow-lg shadow-purple-500/20' 
                                    : 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800'
                            }
                        `}
                    >
                        {item.definition}
                    </button>
                )
            })}
        </div>
      </div>
    </div>
  );
};

export default MatchGame;
