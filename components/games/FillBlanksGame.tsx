import React, { useState } from 'react';
import { FillBlankItem } from '../../types';
import { RefreshCcw, ArrowRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FillBlanksGameProps {
  items: FillBlankItem[];
  onReset: () => void;
}

const FillBlanksGame: React.FC<FillBlanksGameProps> = ({ items, onReset }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentItem = items[currentIndex];

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;
    
    setSelectedOption(option);
    setIsAnswered(true);
    
    if (option === currentItem.correctAnswer) {
      setScore(s => s + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#06b6d4', '#3b82f6']
      });
    }
  };

  const nextQuestion = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="glass-panel p-10 rounded-3xl text-center max-w-2xl mx-auto animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
          Sonuçlar
        </h2>
        <div className="text-6xl font-black mb-4 text-white">
          {score} / {items.length}
        </div>
        <p className="text-zinc-400 mb-8 text-lg">
          Tebrikler! Cümleleri başarıyla tamamladın.
        </p>
        <button 
          onClick={onReset}
          className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mx-auto"
        >
          <RefreshCcw size={20} /> Yeni Oyun
        </button>
      </div>
    );
  }

  // Split sentence by "___" to insert visual blank
  const parts = currentItem.sentence.split('___');

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Progress */}
      <div className="w-full bg-zinc-800 h-1.5 rounded-full mb-10 overflow-hidden">
          <div className="bg-cyan-500 h-full transition-all duration-500" style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}></div>
      </div>

      <div className="glass-panel p-8 md:p-14 rounded-3xl relative animate-fade-in">
        
        {/* Sentence Display */}
        <div className="text-2xl md:text-3xl font-medium text-center leading-loose mb-12 text-zinc-200">
            {parts[0]}
            <span className={`
                inline-block min-w-[120px] border-b-4 mx-2 px-2 text-center font-bold transition-all
                ${isAnswered 
                    ? selectedOption === currentItem.correctAnswer 
                        ? 'border-green-500 text-green-400 bg-green-500/10 rounded-t-lg' 
                        : 'border-red-500 text-red-400 bg-red-500/10 rounded-t-lg'
                    : 'border-cyan-500/50 bg-zinc-900/50 text-cyan-200 rounded-t-lg animate-pulse'
                }
            `}>
                {selectedOption || "?"}
            </span>
            {parts[1]}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentItem.options.map((option, idx) => {
                let btnClass = "bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:border-zinc-500";
                
                if (isAnswered) {
                    if (option === currentItem.correctAnswer) {
                        btnClass = "bg-green-500/20 border-green-500 text-green-200";
                    } else if (option === selectedOption) {
                        btnClass = "bg-red-500/20 border-red-500 text-red-200 opacity-50";
                    } else {
                        btnClass = "opacity-30 border-transparent";
                    }
                }

                return (
                    <button
                        key={idx}
                        onClick={() => handleOptionClick(option)}
                        disabled={isAnswered}
                        className={`
                            py-4 px-6 rounded-xl border-2 font-semibold text-lg transition-all duration-300
                            ${btnClass}
                        `}
                    >
                        {option}
                    </button>
                )
            })}
        </div>

        <div className="mt-10 h-12 flex justify-end">
            {isAnswered && (
                <button
                onClick={nextQuestion}
                className="bg-white text-black hover:bg-zinc-200 px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 animate-fade-in"
                >
                {currentIndex === items.length - 1 ? "Bitir" : "Devam Et"} <ArrowRight size={20} />
                </button>
            )}
        </div>

      </div>
    </div>
  );
};

export default FillBlanksGame;
