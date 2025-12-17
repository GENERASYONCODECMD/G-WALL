import React, { useState, useEffect } from 'react';
import { SortingItem } from '../../types';
import { RefreshCcw, ArrowDown, ArrowUp, CheckCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SortingGameProps {
  items: SortingItem[];
  onReset: () => void;
}

const SortingGame: React.FC<SortingGameProps> = ({ items, onReset }) => {
  const [currentOrder, setCurrentOrder] = useState<SortingItem[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    // Shuffle initial order
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setCurrentOrder(shuffled);
    setIsChecked(false);
    setIsCorrect(false);
  }, [items]);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (isChecked && isCorrect) return; // Lock if won

    const newOrder = [...currentOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newOrder.length) {
      [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
      setCurrentOrder(newOrder);
      // Reset check status if they move something after checking
      if (isChecked) setIsChecked(false);
    }
  };

  const handleCheck = () => {
    // Verify order
    let correct = true;
    for (let i = 0; i < currentOrder.length; i++) {
       // We can't just check index vs index because the array might be sorted but offsets differ.
       // Actually, we expect them to be in order of their orderIndex property.
       // Let's assume the items provided form a continuous sequence.
       
       // Better check: Is current item's orderIndex < next item's orderIndex?
       if (i < currentOrder.length - 1) {
          if (currentOrder[i].orderIndex > currentOrder[i+1].orderIndex) {
              correct = false;
              break;
          }
       }
    }

    setIsChecked(true);
    setIsCorrect(correct);

    if (correct) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  if (isChecked && isCorrect) {
     // Show win state inline or separate? Inline is better for sorting to see the result.
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="text-center mb-8">
          <p className="text-zinc-400 text-sm uppercase tracking-widest font-bold">Doğru Sıraya Diz</p>
          <p className="text-xs text-zinc-500 mt-1">(Yukarıdan Aşağıya: Küçükten Büyüğe veya Kronolojik)</p>
      </div>

      <div className="space-y-3">
        {currentOrder.map((item, index) => {
            // Determine visual state based on check
            let statusClass = "border-zinc-700 bg-zinc-800/50";
            if (isChecked) {
                // Determine if this specific item is roughly in right place relative to neighbors? 
                // Hard to do individually. We'll color the whole list green if won, or normal if not.
                if (isCorrect) statusClass = "border-green-500 bg-green-500/20 text-green-100";
            }

            return (
                <div key={item.id} className={`flex items-center gap-3 transition-all duration-300 ${isChecked && isCorrect ? 'scale-105' : ''}`}>
                    <div className="flex flex-col gap-1">
                        <button 
                            onClick={() => moveItem(index, 'up')}
                            disabled={index === 0 || (isChecked && isCorrect)}
                            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-20 text-zinc-400 hover:text-white transition-colors"
                        >
                            <ArrowUp size={16} />
                        </button>
                        <button 
                            onClick={() => moveItem(index, 'down')}
                            disabled={index === currentOrder.length - 1 || (isChecked && isCorrect)}
                            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-20 text-zinc-400 hover:text-white transition-colors"
                        >
                            <ArrowDown size={16} />
                        </button>
                    </div>
                    
                    <div className={`
                        flex-1 p-4 rounded-xl border-2 flex items-center justify-between
                        ${statusClass}
                    `}>
                        <span className="font-bold text-lg">{item.content}</span>
                        {isChecked && isCorrect && <CheckCircle size={20} className="text-green-400" />}
                    </div>
                    
                    <div className="w-8 flex justify-center text-zinc-600 font-mono font-bold">
                        {index + 1}
                    </div>
                </div>
            )
        })}
      </div>

      <div className="mt-10 flex justify-center gap-4">
        {isChecked && isCorrect ? (
             <div className="text-center animate-fade-in">
                 <h3 className="text-2xl font-bold text-green-400 mb-4">Sıralama Doğru!</h3>
                 <button 
                    onClick={onReset}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mx-auto"
                >
                    <RefreshCcw size={20} /> Yeni Oyun
                </button>
             </div>
        ) : (
            <button
                onClick={handleCheck}
                className="bg-rose-600 hover:bg-rose-500 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg shadow-rose-500/20 transition-all hover:scale-105 flex items-center gap-2"
            >
                Kontrol Et <ArrowRight size={20} />
            </button>
        )}
      </div>
    </div>
  );
};

export default SortingGame;
