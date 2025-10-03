// Mude a porta se a sua API C# estiver rodando em uma diferente
const API_BASE_URL = 'https://localhost:7169/api';

// Tipos para garantir a segurança dos dados
type AnalysisDetail = {
  id: number;
  name: string;
  inputText: string;
  createdAt: string;
  status: string;
  results: Array<{
    keyword: string;
    wasFound: boolean;
    occurrences: Array<{
      text: string;
      snippet: string;
    }> | null;
  }>;
};
type AnalysisSummary = { id: number; name: string; createdAt: string };
type LibraryKeyword = { id: number; keyword: string };
type CreateAnalysisPayload = { name: string; inputText: string; keywords: string[] };


// NOVA FUNÇÃO: Função para buscar uma análise específica pelo ID
export const getAnalysisById = async (id: number): Promise<AnalysisDetail | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyses/${id}`);
    if (!response.ok) {
      // Se a análise não for encontrada (erro 404), retorna nulo.
      if (response.status === 404) return null;
      throw new Error('Falha ao buscar os detalhes da análise');
    }
    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Função para buscar o histórico de análises
export const getHistory = async (): Promise<AnalysisSummary[]> => {
  const response = await fetch(`${API_BASE_URL}/analyses`);
  if (!response.ok) {
    throw new Error('Falha ao buscar o histórico');
  }
  return response.json();
};

// Função para buscar as palavras da biblioteca
export const getLibraryKeywords = async (): Promise<LibraryKeyword[]> => {
  const response = await fetch(`${API_BASE_URL}/library/keywords`);
  if (!response.ok) {
    throw new Error('Falha ao buscar as palavras da biblioteca');
  }
  return response.json();
};

// Função para criar uma nova análise
export const createAnalysis = async (payload: CreateAnalysisPayload): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/analyses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Falha ao criar a análise');
  }
  return response.json();
};

export const addKeywordToLibrary = async (keyword: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/library/keywords`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keyword }),
    });

    if (!response.ok) {
      // O backend retorna 'Conflict' se a palavra já existe.
      // Podemos tratar isso silenciosamente ou mostrar um erro.
      // Por enquanto, vamos apenas lançar um erro genérico.
      throw new Error('Falha ao adicionar palavra-chave à biblioteca');
    }
    return response.json();
  } catch (error) {
    console.error(error);
    // Retorna nulo em caso de erro para não quebrar a aplicação
    return null;
  }
};