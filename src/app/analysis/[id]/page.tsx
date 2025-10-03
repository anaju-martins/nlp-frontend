// src/app/analysis/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { getAnalysisById } from '@/lib/api'; // Importamos a nova função da API
import { Box, Typography, CircularProgress, Paper, Divider, Chip, List, ListItem, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import styles from './analysis-detail.module.css';

// TypeScript: Definindo o tipo para os detalhes da análise que esperamos receber
type AnalysisDetail = NonNullable<Awaited<ReturnType<typeof getAnalysisById>>>;

// A página recebe 'params' que contém o ID da URL
export default function AnalysisDetailPage({ params }: { params: { id: string } }) {
  const [analysis, setAnalysis] = useState<AnalysisDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchAnalysis = async () => {
        setIsLoading(true);
        setError(null);
        const analysisId = parseInt(id, 10);
        const data = await getAnalysisById(analysisId);
        if (data) {
          setAnalysis(data);
        } else {
          setError("Análise não encontrada ou falha ao carregar.");
        }
        setIsLoading(false);
      };
      fetchAnalysis();
    }
  }, [id]); // Roda o efeito sempre que o ID na URL mudar

  if (isLoading) {
    return <Box className={styles.center}><CircularProgress /></Box>;
  }

  if (error) {
    return <Box className={styles.center}><Typography color="error">{error}</Typography></Box>;
  }

  if (!analysis) {
    return <Box className={styles.center}><Typography>Nenhum dado de análise para exibir.</Typography></Box>;
  }

  return (
    <Paper className={styles.container}>
      {/* Cabeçalho com Nome e Data */}
      <Typography variant="h4" component="h1" gutterBottom>{analysis.name}</Typography>
      <Typography variant="caption" color="text.secondary" gutterBottom>
        Criado em: {new Date(analysis.createdAt).toLocaleString('pt-BR')}
      </Typography>
      <Divider sx={{ my: 2 }} />

      {/* Seção de Resultados */}
      <Typography variant="h5" gutterBottom>Resultados</Typography>
      <Box>
        {analysis.results.map(result => (
          <Paper key={result.keyword} variant="outlined" className={styles.resultCard}>
            <Chip
              label={result.keyword}
              icon={result.wasFound ? <CheckCircleIcon /> : <CancelIcon />}
              color={result.wasFound ? "success" : "error"}
              size="small"
              sx={{ mb: 1 }}
            />
            {result.wasFound && result.occurrences && (
              <List dense>
                {result.occurrences.map((occ, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`"${occ.snippet}"`} />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Seção com o Texto Original */}
      <Typography variant="h5" gutterBottom>Texto Original Analisado</Typography>
      <Paper variant="outlined" className={styles.inputTextPaper}>
        <pre className={styles.preformattedText}>{analysis.inputText}</pre>
      </Paper>
    </Paper>
  );
}