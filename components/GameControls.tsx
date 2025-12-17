import React, { useState, useEffect } from 'react';
import { GameMode, GradeLevel, GeneratorConfig } from '../types';
import { Sparkles, BookOpen, GraduationCap, BrainCircuit, CheckSquare, Puzzle, Type, AlignLeft, Layers, Grid } from 'lucide-react';

interface GameControlsProps {
  onGenerate: (config: GeneratorConfig) => void;
  isGenerating: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onGenerate, isGenerating }) => {
  const [grade, setGrade] = useState<GradeLevel>(GradeLevel.GRADE_5);
  const [subject, setSubject] = useState('Matematik');
  const [topic, setTopic] = useState('');
  const [mode, setMode] = useState<GameMode>(GameMode.QUIZ);

  // Dynamic Subject List based on Grade (MEB Curriculum)
  const getSubjects = (g: GradeLevel) => {
    const commonSubjects = [
      "Matematik",
      "Fen Bilimleri",
      "Türkçe",
      "İngilizce",
      "Din Kültürü ve Ahlak Bilgisi",
      "Bilişim Teknolojileri",
      "Türk Sosyal Hayatında Aile (Seçmeli)",
      "Hukuk ve Adalet (Seçmeli)",
      "Görgü Kuralları ve Nezaket (Seçmeli)"
    ];

    if (g === GradeLevel.GRADE_8) {
      return ["T.C. İnkılap Tarihi ve Atatürkçülük", ...commonSubjects];
    } else {
      return ["Sosyal Bilgiler", ...commonSubjects];
    }
  };

  const currentSubjects = getSubjects(grade);

  // Reset subject if it's not in the new list when grade changes
  useEffect(() => {
    const subjects = getSubjects(grade);
    if (!subjects.includes(subject)) {
      setSubject(subjects[0]);
    }
  }, [grade]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGenerate({ grade, subject, topic, mode });
  };

  const gameModes = [
    { 
      id: GameMode.QUIZ, 
      label: 'Test Çöz', 
      icon: CheckSquare, 
      color: 'from-blue-500 to-indigo-600',
      desc: 'Çoktan seçmeli sorular'
    },
    { 
      id: GameMode.MATCHING, 
      label: 'Eşleştirme', 
      icon: Puzzle, 
      color: 'from-purple-500 to-pink-600',
      desc: 'Kavramları eşleştir'
    },
    { 
      id: GameMode.MEMORY, 
      label: 'Hafıza Kartları', 
      icon: Grid, 
      color: 'from-amber-500 to-orange-600',
      desc: 'Kartları aklında tut'
    },
    { 
      id: GameMode.SORTING, 
      label: 'Sıralama', 
      icon: Layers, 
      color: 'from-rose-500 to-red-600',
      desc: 'Sıraya diz (Tarih/Mat)'
    },
    { 
      id: GameMode.TRUE_FALSE, 
      label: 'Doğru/Yanlış', 
      icon: BrainCircuit, 
      color: 'from-emerald-500 to-teal-600',
      desc: 'Hızlı bilgi yarışı'
    },
    { 
      id: GameMode.WORD_SCRAMBLE, 
      label: 'Kelime Avı', 
      icon: Type, 
      color: 'from-violet-500 to-purple-600',
      desc: 'Karışık harfleri çöz'
    },
    { 
      id: GameMode.FILL_BLANKS, 
      label: 'Boşluk Doldur', 
      icon: AlignLeft, 
      color: 'from-cyan-500 to-blue-600',
      desc: 'Cümleyi tamamla'
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto mb-12">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Input Section */}
        <div className="glass-panel p-8 rounded-3xl shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
             
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Inputs */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <label className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                                <GraduationCap size={16} /> Sınıf Seviyesi
                             </label>
                             <select 
                                value={grade} 
                                onChange={(e) => setGrade(e.target.value as GradeLevel)}
                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                             >
                                {Object.values(GradeLevel).map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                             </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                                <BookOpen size={16} /> Ders (MEB Müfredatı)
                            </label>
                            <div className="relative">
                                <select 
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                                >
                                    {currentSubjects.map(subj => (
                                        <option key={subj} value={subj}>{subj}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                            <Sparkles size={16} /> Konu / Ünite
                        </label>
                        <input 
                            type="text" 
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder={subject.includes('İngilizce') ? "Örn: Simple Present Tense, Daily Routines" : "Örn: Basınç, Cümlede Anlam, Miras"}
                            className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                            required
                        />
                    </div>
                </div>

                {/* Generate Action */}
                <div className="lg:col-span-4 flex items-end">
                    <button
                        type="submit"
                        disabled={isGenerating}
                        className={`
                        w-full h-20 lg:h-full relative group overflow-hidden rounded-2xl font-bold text-white text-xl transition-all shadow-xl
                        ${isGenerating ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02] active:scale-[0.98]'}
                        `}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 transition-all duration-300 group-hover:opacity-100 opacity-90"></div>
                        <div className="relative flex flex-col items-center justify-center h-full gap-2">
                        {isGenerating ? (
                            <>
                                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span className="text-sm font-medium tracking-wide">HAZIRLANIYOR...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-8 h-8" />
                                <span>OYUN OLUŞTUR</span>
                            </>
                        )}
                        </div>
                    </button>
                </div>
             </div>
        </div>

        {/* Game Mode Selector */}
        <div className="space-y-4">
             <h3 className="text-zinc-400 font-medium ml-2">Oyun Modunu Seçin</h3>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                {gameModes.map((m) => {
                    const Icon = m.icon;
                    const isSelected = mode === m.id;
                    return (
                        <div 
                            key={m.id}
                            onClick={() => setMode(m.id)}
                            className={`
                                relative cursor-pointer rounded-2xl p-3 border-2 transition-all duration-300 group overflow-hidden h-36 flex flex-col justify-between
                                ${isSelected 
                                    ? 'border-transparent transform scale-105 shadow-2xl z-10' 
                                    : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800 hover:border-zinc-600'
                                }
                            `}
                        >
                            {isSelected && (
                                <div className={`absolute inset-0 bg-gradient-to-br ${m.color} opacity-20`}></div>
                            )}
                            
                            <div className={`
                                w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-all
                                ${isSelected ? `bg-gradient-to-br ${m.color} text-white` : 'bg-zinc-800 text-zinc-400 group-hover:text-white group-hover:bg-zinc-700'}
                            `}>
                                <Icon size={18} />
                            </div>
                            
                            <div>
                                <div className={`font-bold text-sm leading-tight mb-1 ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                                    {m.label}
                                </div>
                                <div className="text-[10px] text-zinc-500 leading-tight">
                                    {m.desc}
                                </div>
                            </div>
                            
                            {isSelected && (
                                <div className="absolute inset-0 ring-2 ring-indigo-500/50 rounded-2xl"></div>
                            )}
                        </div>
                    )
                })}
             </div>
        </div>
      </form>
    </div>
  );
};

export default GameControls;