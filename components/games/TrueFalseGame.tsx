import React, { useState } from 'react';
import { TrueFalseItem } from '../../types';
import { Check, X, RefreshCcw } from 'lucide-react';

interface TrueFalseGameProps {
  items: TrueFalseItem[];
  onReset: () => void;
}

const TrueFalseGame: React.FC<TrueFalseGameProps> = ({ items, onReset }) => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const handleChoice = (choice: boolean) => {
    if (feedback) return;

    const correct = items[index].isTrue === choice;
    
    if (correct) {
      setScore(s => s + 1);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      if (index < items.length - 1) {
        setIndex(i => i + 1);
      } else {
        setShowResult(true);
      }
    }, 800);
  };

  if (showResult) {
    return (
        <div className="glass-panel p-10 rounded-3xl text-center max-w-2xl mx-auto animate-fade-in">
          <h2 className="text-3xl font-bold mb-6 text-white">Oyun Bitti!</h2>
          <div className="text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-orange-400">
            {score} / {items.length}
          </div>
          <button 
            onClick={onReset}
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCcw size={20} /> Tekrar Dene
          </button>
        </div>
      );
  }

  const currentItem = items[index];

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className={`
        glass-panel p-12 rounded-3xl text-center relative transition-all duration-300
        ${feedback === 'correct' ? 'border-green-500 shadow-[0_0_50px_-12px_rgba(34,197,94,0.3)]' : ''}
        ${feedback === 'wrong' ? 'border-red-500 shadow-[0_0_50px_-12px_rgba(239,68,68,0.3)]' : ''}
      `}>
        <div className="absolute top-4 right-6 text-zinc-500 font-mono text-sm">
            {index + 1} / {items.length}
        </div>

        <h3 className="text-2xl md:text-4xl font-bold text-white mb-12 min-h-[120px] flex items-center justify-center">
            {currentItem.statement}
        </h3>

        <div className="grid grid-cols-2 gap-6">
            <button
                onClick={() => handleChoice(true)}
                disabled={!!feedback}
                className="group relative h-32 rounded-2xl bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/30 hover:border-green-400 hover:bg-green-900/60 transition-all flex flex-col items-center justify-center"
            >
                <Check className="w-10 h-10 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-green-100 font-bold text-xl">DOĞRU</span>
            </button>

            <button
                onClick={() => handleChoice(false)}
                disabled={!!feedback}
                className="group relative h-32 rounded-2xl bg-gradient-to-br from-red-900/40 to-red-800/20 border border-red-500/30 hover:border-red-400 hover:bg-red-900/60 transition-all flex flex-col items-center justify-center"
            >
                <X className="w-10 h-10 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-red-100 font-bold text-xl">YANLIŞ</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default TrueFalseGame;
