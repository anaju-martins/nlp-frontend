import { create } from 'zustand';
import { getHistory, getLibraryKeywords, createAnalysis, addKeywordToLibrary } from '@/lib/api';

// Tipos para nossos dados
type AnalysisSummary = {
  id: number;
  name: string;
  createdAt: string;
};

type LibraryKeyword = {
  id: number;
  keyword: string;
};

// Definindo o estado e as ações
type AnalysisState = {
  history: AnalysisSummary[];
  libraryKeywords: LibraryKeyword[];
  currentKeywords: string[];
  analysisResult: any | null;
  isLoading: boolean;
  fetchHistory: () => Promise<void>;
  fetchLibraryKeywords: () => Promise<void>;
  addKeyword: (keyword: string) => void;
  removeKeyword: (keywordToRemove: string) => void;
  runAnalysis: (name: string, text: string) => Promise<void>;
  clearResult: () => void;
  saveKeywordToLibrary: (keyword: string) => Promise<void>;
};

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  history: [],
  libraryKeywords: [],
  currentKeywords: [],
  analysisResult: null,
  isLoading: false,

  fetchHistory: async () => {
    const history = await getHistory();
    set({ history });
  },

  fetchLibraryKeywords: async () => {
    const libraryKeywords = await getLibraryKeywords();
    set({ libraryKeywords });
  },

  addKeyword: (keyword) => {
    if (!keyword.trim() || get().currentKeywords.includes(keyword.trim())) return;
    set((state) => ({
      currentKeywords: [...state.currentKeywords, keyword.trim()],
    }));
  },
  
  removeKeyword: (keywordToRemove) => {
    set((state) => ({
      currentKeywords: state.currentKeywords.filter(k => k !== keywordToRemove),
    }));
  },

  runAnalysis: async (name, text) => {
    set({ isLoading: true, analysisResult: null });
    try {
      const result = await createAnalysis({
        name,
        inputText: text,
        keywords: get().currentKeywords,
      });
      set({ analysisResult: result, isLoading: false });
      // Após uma análise bem-sucedida, atualize o histórico
      get().fetchHistory();
    } catch (error) {
      console.error("Analysis failed:", error);
      set({ isLoading: false, analysisResult: { error: "A análise falhou." } });
    }
  },
  
  clearResult: () => {
      set({ analysisResult: null, currentKeywords: [] });
  },
  saveKeywordToLibrary: async (keyword) => {
    // Evita chamadas duplicadas se a palavra já estiver na biblioteca local
    const alreadyExists = get().libraryKeywords.some(libKeyword => libKeyword.keyword.toLowerCase() === keyword.toLowerCase());
    if (alreadyExists) {
      console.log(`A palavra "${keyword}" já está na biblioteca.`);
      return;
    }

    const newLibraryKeyword = await addKeywordToLibrary(keyword);

    if (newLibraryKeyword) {
      // Se a chamada for bem-sucedida, atualize o estado local
      // para que a UI mude a estrela para preenchida instantaneamente.
      set(state => ({
        libraryKeywords: [...state.libraryKeywords, newLibraryKeyword]
      }));
    }
    // Se a chamada falhar (ex: a palavra já existe no DB), o estado não muda.
  },
}));