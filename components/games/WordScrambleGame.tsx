import React, { useState, useEffect } from 'react';
import { WordScrambleItem } from '../../types';
import { RefreshCcw, Lightbulb, ArrowRight, Shuffle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WordScrambleGameProps {
  items: WordScrambleItem[];
  onReset: () => void;
}

const WordScrambleGame: React.FC<WordScrambleGameProps> = ({ items, onReset }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<{ id: number, letter: string }[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<{ id: number, letter: string }[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const currentItem = items[currentIndex];

  useEffect(() => {
    scrambleWord();
    setSelectedLetters([]);
    setFeedback(null);
  }, [currentIndex]);

  const scrambleWord = () => {
    const letters = currentItem.word.split('').map((letter, index) => ({
      id: index,
      letter
    }));
    // Fisher-Yates shuffle
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    setScrambledLetters(letters);
    setSelectedLetters([]);
  };

  const handleLetterClick = (item: { id: number, letter: string }) => {
    // Move from bank to selection
    setScrambledLetters(prev => prev.filter(l => l.id !== item.id));
    setSelectedLetters(prev => [...prev, item]);
  };

  const handleSelectedLetterClick = (item: { id: number, letter: string }) => {
    // Move from selection back to bank
    setSelectedLetters(prev => prev.filter(l => l.id !== item.id));
    setScrambledLetters(prev => [...prev, item]);
  };

  const checkAnswer = () => {
    const currentWord = selectedLetters.map(l => l.letter).join('');
    if (currentWord === currentItem.word) {
      setScore(s => s + 1);
      setFeedback('correct');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        if (currentIndex < items.length - 1) {
          setCurrentIndex(c => c + 1);
        } else {
          setShowResult(true);
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  if (showResult) {
    return (
      <div className="glass-panel p-10 rounded-3xl text-center max-w-2xl mx-auto animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
          Oyun Bitti!
        </h2>
        <div className="text-6xl font-black mb-4 text-white">
          {score} / {items.length}
        </div>
        <p className="text-zinc-400 mb-8 text-lg">Kelime hazinen harika!</p>
        <button 
          onClick={onReset}
          className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mx-auto"
        >
          <RefreshCcw size={20} /> Yeni Oyun
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full">
        {/* Progress */}
        <div className="flex justify-between items-center mb-8 px-4">
             <div className="flex gap-1">
                 {items.map((_, idx) => (
                     <div key={idx} className={`h-2 w-8 rounded-full transition-all ${idx === currentIndex ? 'bg-orange-500 w-12' : idx < currentIndex ? 'bg-orange-500/50' : 'bg-zinc-800'}`}></div>
                 ))}
             </div>
             <span className="text-zinc-500 font-mono text-sm">{currentIndex + 1} / {items.length}</span>
        </div>

      <div className={`glass-panel p-8 md:p-12 rounded-3xl relative animate-fade-in transition-all duration-300 ${feedback === 'correct' ? 'border-green-500' : feedback === 'wrong' ? 'border-red-500 shake-animation' : ''}`}>
        
        {/* Hint Section */}
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-10 flex items-start gap-3">
             <div className="bg-orange-500/20 p-2 rounded-lg">
                <Lightbulb className="text-orange-400 w-5 h-5" />
             </div>
             <p className="text-orange-100/80 text-lg leading-relaxed">{currentItem.hint}</p>
        </div>

        {/* Selected Letters Area (The Input) */}
        <div className="min-h-[80px] mb-8 flex justify-center gap-2 flex-wrap">
          {selectedLetters.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectedLetterClick(item)}
              className="w-12 h-14 md:w-16 md:h-20 bg-white text-black text-2xl md:text-4xl font-bold rounded-xl shadow-lg hover:bg-red-50 hover:scale-105 transition-all flex items-center justify-center border-b-4 border-zinc-300"
            >
              {item.letter}
            </button>
          ))}
          {/* Placeholders for remaining letters */}
          {Array.from({ length: Math.max(0, currentItem.word.length - selectedLetters.length) }).map((_, i) => (
             <div key={i} className="w-12 h-14 md:w-16 md:h-20 border-2 border-dashed border-zinc-700 rounded-xl"></div>
          ))}
        </div>

        {/* Scrambled Letters Bank */}
        <div className="flex justify-center gap-3 flex-wrap mb-12">
          {scrambledLetters.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLetterClick(item)}
              className="w-12 h-14 md:w-16 md:h-20 bg-zinc-800 text-zinc-300 text-2xl md:text-4xl font-bold rounded-xl hover:bg-zinc-700 hover:text-white hover:-translate-y-1 transition-all flex items-center justify-center border-b-4 border-zinc-950 shadow-lg"
            >
              {item.letter}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
           <button 
             onClick={scrambleWord}
             className="w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all"
             title="Karıştır"
           >
              <Shuffle size={20} />
           </button>
           <button
              onClick={checkAnswer}
              disabled={selectedLetters.length !== currentItem.word.length}
              className={`
                 px-8 py-3 rounded-xl font-bold text-lg flex items-center gap-2 transition-all
                 ${selectedLetters.length === currentItem.word.length 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 transform hover:scale-105' 
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}
              `}
           >
              Kontrol Et <ArrowRight size={20} />
           </button>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .shake-animation {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default WordScrambleGame;
