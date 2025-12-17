import React, { useState } from 'react';
import Background from './components/Background';
import GameControls from './components/GameControls';
import QuizGame from './components/games/QuizGame';
import MatchGame from './components/games/MatchGame';
import TrueFalseGame from './components/games/TrueFalseGame';
import WordScrambleGame from './components/games/WordScrambleGame';
import FillBlanksGame from './components/games/FillBlanksGame';
import MemoryGame from './components/games/MemoryGame';
import SortingGame from './components/games/SortingGame';
import { generateGameContent } from './services/geminiService';
import { GameContent, GameMode, GeneratorConfig, QuizItem, MatchItem, TrueFalseItem, WordScrambleItem, FillBlankItem, SortingItem } from './types';
import { ArrowLeft, BrainCircuit } from 'lucide-react';

function App() {
  const [gameContent, setGameContent] = useState<GameContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (config: GeneratorConfig) => {
    setIsGenerating(true);
    setError(null);
    try {
      const content = await generateGameContent(
        config.grade,
        config.subject,
        config.topic,
        config.mode
      );
      setGameContent(content);
    } catch (err) {
      setError("Oyun oluşturulurken bir hata oluştu. Lütfen tekrar deneyin veya farklı bir konu deneyin.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setGameContent(null);
    setError(null);
  };

  const renderGame = () => {
    if (!gameContent) return null;

    switch (gameContent.mode) {
      case GameMode.QUIZ:
        return <QuizGame items={gameContent.items as QuizItem[]} onReset={handleReset} />;
      case GameMode.MATCHING:
        return <MatchGame items={gameContent.items as MatchItem[]} onReset={handleReset} />;
      case GameMode.MEMORY:
        return <MemoryGame items={gameContent.items as MatchItem[]} onReset={handleReset} />;
      case GameMode.SORTING:
        return <SortingGame items={gameContent.items as SortingItem[]} onReset={handleReset} />;
      case GameMode.TRUE_FALSE:
        return <TrueFalseGame items={gameContent.items as TrueFalseItem[]} onReset={handleReset} />;
      case GameMode.WORD_SCRAMBLE:
        return <WordScrambleGame items={gameContent.items as WordScrambleItem[]} onReset={handleReset} />;
      case GameMode.FILL_BLANKS:
        return <FillBlanksGame items={gameContent.items as FillBlankItem[]} onReset={handleReset} />;
      default:
        return <div className="text-center text-red-400">Desteklenmeyen oyun modu.</div>;
    }
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-indigo-500/30">
      <Background />
      
      <main className="container mx-auto px-4 py-8 relative z-10 pb-20">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-12 md:mb-16">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
              <BrainCircuit className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">MindForge AI</h1>
              <span className="text-xs text-zinc-500 font-bold tracking-widest uppercase">Eğitim Platformu</span>
            </div>
          </div>
          
          {gameContent && (
             <button 
               onClick={handleReset}
               className="px-4 py-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-700 text-sm font-medium text-zinc-300 hover:text-white flex items-center gap-2 transition-all border border-zinc-700 hover:border-zinc-500"
             >
                <ArrowLeft size={16} /> <span className="hidden md:inline">Ana Menü</span>
             </button>
          )}
        </header>

        {/* Content */}
        {!gameContent ? (
          <div className="animate-fade-in">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-600 tracking-tight">
                Sınırsız Oyun
              </h2>
              <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
                Matematik, Tarih veya Fen Bilgisi... Konunu seç, yapay zeka sana özel 
                <span className="text-indigo-400 font-semibold"> binlerce farklı varyasyonda</span> oyun yaratsın.
              </p>
            </div>
            
            <GameControls onGenerate={handleGenerate} isGenerating={isGenerating} />
            
            {error && (
               <div className="max-w-md mx-auto p-4 bg-red-500/10 border border-red-500/30 text-red-200 rounded-xl text-center text-sm mb-8 animate-pulse">
                  {error}
               </div>
            )}
            
            <div className="text-center opacity-40">
                <div className="inline-flex gap-8 text-sm font-mono text-zinc-500 uppercase tracking-widest">
                    <span>Powered by Gemini 2.5</span>
                    <span>•</span>
                    <span>Sonsuz İçerik</span>
                </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in space-y-8">
            <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{gameContent.title}</h2>
               <p className="text-zinc-400 text-lg max-w-2xl mx-auto">{gameContent.description}</p>
            </div>
            {renderGame()}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
