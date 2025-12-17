import React, { useState } from 'react';
import { QuizItem } from '../../types';
import { CheckCircle, XCircle, ArrowRight, RefreshCcw } from 'lucide-react';

interface QuizGameProps {
  items: QuizItem[];
  onReset: () => void;
}

const QuizGame: React.FC<QuizGameProps> = ({ items, onReset }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentItem = items[currentIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentItem.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    return (
      <div className="glass-panel p-10 rounded-3xl text-center max-w-2xl mx-auto animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          Sonuçlar
        </h2>
        <div className="text-6xl font-black mb-4 text-white">
          {score} / {items.length}
        </div>
        <p className="text-zinc-400 mb-8 text-lg">
          {score === items.length ? "Mükemmel! Hepsini bildin." : "Güzel deneme, tekrar dene!"}
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

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-zinc-800 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
          style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
        ></div>
      </div>

      <div className="glass-panel p-8 md:p-12 rounded-3xl relative animate-fade-in">
        <span className="absolute top-6 left-8 text-sm font-bold text-zinc-500 tracking-widest">
          SORU {currentIndex + 1} / {items.length}
        </span>

        <h3 className="text-2xl md:text-3xl font-bold text-white mt-6 mb-10 leading-relaxed">
          {currentItem.question}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentItem.options.map((option, index) => {
            let itemClass = "border-zinc-700 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-800/60 hover:border-zinc-600";
            
            if (isAnswered) {
               if (index === currentItem.correctAnswer) {
                 itemClass = "border-green-500/50 bg-green-500/10 text-green-200";
               } else if (index === selectedOption) {
                 itemClass = "border-red-500/50 bg-red-500/10 text-red-200";
               } else {
                 itemClass = "opacity-50 border-zinc-800 bg-zinc-900/20";
               }
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={isAnswered}
                className={`
                  relative p-6 rounded-2xl border-2 text-left transition-all duration-300 group
                  ${itemClass}
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">{option}</span>
                  {isAnswered && index === currentItem.correctAnswer && <CheckCircle className="text-green-500" />}
                  {isAnswered && index === selectedOption && index !== currentItem.correctAnswer && <XCircle className="text-red-500" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end h-12">
          {isAnswered && (
            <button
              onClick={nextQuestion}
              className="bg-white text-black hover:bg-zinc-200 px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 animate-fade-in"
            >
              {currentIndex === items.length - 1 ? "Bitir" : "Sonraki"} <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizGame;
