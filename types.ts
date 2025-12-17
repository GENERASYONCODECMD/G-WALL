export enum GameMode {
  QUIZ = 'QUIZ',
  MATCHING = 'MATCHING',
  TRUE_FALSE = 'TRUE_FALSE',
  WORD_SCRAMBLE = 'WORD_SCRAMBLE',
  FILL_BLANKS = 'FILL_BLANKS',
  MEMORY = 'MEMORY',
  SORTING = 'SORTING'
}

export enum GradeLevel {
  GRADE_5 = '5. Sınıf',
  GRADE_6 = '6. Sınıf',
  GRADE_7 = '7. Sınıf',
  GRADE_8 = '8. Sınıf'
}

export interface QuizItem {
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
}

export interface MatchItem {
  id: string;
  term: string;
  definition: string;
}

export interface TrueFalseItem {
  statement: string;
  isTrue: boolean;
}

export interface WordScrambleItem {
  word: string;
  hint: string;
}

export interface FillBlankItem {
  sentence: string; // Sentence with a placeholder like "___"
  correctAnswer: string;
  options: string[]; // Mixed correct answer and distractors
}

export interface SortingItem {
  id: string;
  content: string; // The text to display (e.g., "1/2" or "Start of War")
  orderIndex: number; // The correct order (0, 1, 2...)
}

// Union type for the raw content from AI
export interface GameContent {
  title: string;
  description: string;
  items: QuizItem[] | MatchItem[] | TrueFalseItem[] | WordScrambleItem[] | FillBlankItem[] | SortingItem[];
  mode: GameMode;
}

export interface GeneratorConfig {
  grade: GradeLevel;
  subject: string;
  topic: string;
  mode: GameMode;
}
