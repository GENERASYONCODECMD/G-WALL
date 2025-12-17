import React, { useState, useEffect } from 'react';
import { MatchItem } from '../../types';
import { RefreshCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MemoryGameProps {
  items: MatchItem[];
  onReset: () => void;
}

interface Card {
  uid: string;
  itemId: string;
  content: string;
  type: 'TERM' | 'DEF';
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ items, onReset }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    initializeGame();
  }, [items]);

  const initializeGame = () => {
    // Create pair cards
    const deck: Card[] = [];
    items.forEach(item => {
      deck.push({
        uid: item.id + '-term',
        itemId: item.id,
        content: item.term,
        type: 'TERM',
        isFlipped: false,
        isMatched: false
      });
      deck.push({
        uid: item.id + '-def',
        itemId: item.id,
        content: item.definition,
        type: 'DEF',
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
  };

  const handleCardClick = (index: number) => {
    if (isProcessing || cards[index].isMatched || cards[index].isFlipped) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      setMoves(m => m + 1);
      checkForMatch(newCards, newFlipped[0], newFlipped[1]);
    }
  };

  const checkForMatch = (currentCards: Card[], idx1: number, idx2: number) => {
    const card1 = currentCards[idx1];
    const card2 = currentCards[idx2];

    if (card1.itemId === card2.itemId) {
      // Match!
      setTimeout(() => {
        const matchedCards = [...currentCards];
        matchedCards[idx1].isMatched = true;
        matchedCards[idx2].isMatched = true;
        setCards(matchedCards);
        setFlippedIndices([]);
        setIsProcessing(false);
        
        // Check win
        if (matchedCards.every(c => c.isMatched)) {
             confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
              });
        }
      }, 500);
    } else {
      // No match
      setTimeout(() => {
        const resetCards = [...currentCards];
        resetCards[idx1].isFlipped = false;
        resetCards[idx2].isFlipped = false;
        setCards(resetCards);
        setFlippedIndices([]);
        setIsProcessing(false);
      }, 1000);
    }
  };

  const isComplete = cards.length > 0 && cards.every(c => c.isMatched);

  if (isComplete) {
    return (
      <div className="glass-panel p-10 rounded-3xl text-center max-w-2xl mx-auto animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
          Hafıza Ustası!
        </h2>
        <div className="text-6xl font-black mb-4 text-white">
           {moves} <span className="text-2xl text-zinc-400 font-medium">Hamle</span>
        </div>
        <p className="text-zinc-400 mb-8 text-lg">Mükemmel odaklanma.</p>
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
    <div className="max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6 px-4">
        <div className="text-zinc-400 font-mono">Hamle: <span className="text-white font-bold">{moves}</span></div>
        <div className="text-zinc-400 text-sm">Eşleşen: {cards.filter(c => c.isMatched).length / 2} / {items.length}</div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {cards.map((card, index) => (
          <div 
            key={card.uid} 
            className={`aspect-square md:aspect-[4/3] relative perspective cursor-pointer group`}
            onClick={() => handleCardClick(index)}
          >
            <div className={`
              w-full h-full absolute transition-all duration-500 transform-style-3d
              ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}
            `}>
              {/* Back of Card */}
              <div className="absolute inset-0 backface-hidden bg-zinc-800 border-2 border-zinc-700 rounded-xl flex items-center justify-center shadow-lg group-hover:border-zinc-500 transition-colors">
                <Sparkles className="text-zinc-600 w-8 h-8 opacity-50" />
              </div>

              {/* Front of Card */}
              <div className={`
                absolute inset-0 backface-hidden rotate-y-180 rounded-xl flex items-center justify-center p-2 text-center shadow-xl border-2
                ${card.isMatched 
                   ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-amber-500 text-amber-100' 
                   : 'bg-zinc-900 border-indigo-500 text-white'}
              `}>
                <span className="text-xs md:text-sm font-medium leading-tight select-none">
                  {card.content}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        .perspective { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default MemoryGame;
