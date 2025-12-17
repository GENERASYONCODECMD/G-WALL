import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GameMode, GameContent, GradeLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- SCHEMAS ---

const quizSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    mode: { type: Type.STRING, enum: [GameMode.QUIZ] },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" }
        },
        required: ["question", "options", "correctAnswer"]
      }
    }
  },
  required: ["title", "description", "mode", "items"]
};

// Used for both Classic Matching and Memory Game
const matchSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    mode: { type: Type.STRING, enum: [GameMode.MATCHING, GameMode.MEMORY] },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          term: { type: Type.STRING },
          definition: { type: Type.STRING }
        },
        required: ["id", "term", "definition"]
      }
    }
  },
  required: ["title", "description", "mode", "items"]
};

const tfSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    mode: { type: Type.STRING, enum: [GameMode.TRUE_FALSE] },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          statement: { type: Type.STRING },
          isTrue: { type: Type.BOOLEAN }
        },
        required: ["statement", "isTrue"]
      }
    }
  },
  required: ["title", "description", "mode", "items"]
};

const scrambleSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    mode: { type: Type.STRING, enum: [GameMode.WORD_SCRAMBLE] },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING, description: "The answer word, uppercase" },
          hint: { type: Type.STRING, description: "A hint or definition for the word" }
        },
        required: ["word", "hint"]
      }
    }
  },
  required: ["title", "description", "mode", "items"]
};

const fillBlankSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    mode: { type: Type.STRING, enum: [GameMode.FILL_BLANKS] },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sentence: { type: Type.STRING, description: "Sentence with '___' placeholder" },
          correctAnswer: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-4 options including the correct one" }
        },
        required: ["sentence", "correctAnswer", "options"]
      }
    }
  },
  required: ["title", "description", "mode", "items"]
};

const sortingSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    mode: { type: Type.STRING, enum: [GameMode.SORTING] },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          content: { type: Type.STRING, description: "Item to be sorted (e.g., '1/2', '1071', 'Step 1')" },
          orderIndex: { type: Type.INTEGER, description: "The correct position index (0 for first, etc.)" }
        },
        required: ["id", "content", "orderIndex"]
      }
    }
  },
  required: ["title", "description", "mode", "items"]
};

export const generateGameContent = async (
  grade: GradeLevel,
  subject: string,
  topic: string,
  mode: GameMode
): Promise<GameContent> => {
  
  let selectedSchema: Schema;
  let promptDetails = "";

  switch (mode) {
    case GameMode.QUIZ:
      selectedSchema = quizSchema;
      promptDetails = "Create a multiple-choice quiz with 8-10 challenging questions.";
      break;
    case GameMode.MATCHING:
      selectedSchema = matchSchema;
      promptDetails = "Create 6-8 pairs of terms and definitions.";
      break;
    case GameMode.MEMORY:
      selectedSchema = matchSchema; // Memory uses same structure as Matching
      promptDetails = "Create 6 pairs of concepts that fit on small cards (short text).";
      break;
    case GameMode.TRUE_FALSE:
      selectedSchema = tfSchema;
      promptDetails = "Create 10 statements, thoroughly mixing true and false facts.";
      break;
    case GameMode.WORD_SCRAMBLE:
      selectedSchema = scrambleSchema;
      promptDetails = "Create 6 important keywords related to the topic. Provide a helpful hint.";
      break;
    case GameMode.FILL_BLANKS:
      selectedSchema = fillBlankSchema;
      promptDetails = "Create 6 sentences with one key missing word represented by '___'. Provide options.";
      break;
    case GameMode.SORTING:
      selectedSchema = sortingSchema;
      promptDetails = "Create a list of 5-7 items that need to be put in a specific order. Examples: Mathematical values (small to large), Historical timeline, Steps in a process.";
      break;
    default:
      throw new Error("Invalid game mode");
  }

  const isEnglish = subject.toLowerCase().includes("ingilizce") || subject.toLowerCase().includes("english");
  const languageInstruction = isEnglish 
    ? "Language: The educational content (questions, answers, terms) MUST be in English. Instructions or hints can be in Turkish if helpful for 5-8th grade level." 
    : "Language: Turkish (Türkçe)";

  const prompt = `
    You are an expert educational content creator for Middle School students (Turkish MEB Curriculum).
    
    Target Audience: ${grade}
    Subject: ${subject}
    Specific Topic: ${topic}
    Game Mode: ${mode}
    
    Task: ${promptDetails}
    ${languageInstruction}
    
    IMPORTANT INSTRUCTIONS:
    1. STRICTLY FOLLOW the Turkish Ministry of National Education (MEB) curriculum for the selected grade.
    2. If the subject is Math (Matematik): Use clear text representation for formulas. For sorting games, provide numbers, fractions, or decimals that are tricky to order.
    3. If the subject is English (İngilizce): The content MUST be in English.
    4. If the subject is Religious Culture (Din Kültürü) or Family (Aile): Ensure content is respectful, accurate, and aligns with moral education standards.
    5. If the subject is History/Revolution (İnkılap Tarihi/Sosyal): Focus on key dates, figures, and events.
    6. Ensure difficulty is appropriate for ${grade}.
    7. Make content diverse and unique every time.
    8. Return strictly JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: selectedSchema,
      },
    });

    if (!response.text) {
      throw new Error("No response generated");
    }

    const data = JSON.parse(response.text) as GameContent;
    
    // Force mode consistency in case LLM hallucinates
    if (mode === GameMode.MEMORY) data.mode = GameMode.MEMORY;
    
    return data;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};