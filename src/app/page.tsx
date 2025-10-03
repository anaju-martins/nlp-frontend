// src/app/page.tsx
"use client"; // Marcamos como um componente de cliente, pois ele renderiza outros componentes interativos.

import { Typography, Box, Paper } from "@mui/material";
import styles from './page.module.css';
import { AnalysisForm } from "@/components/AnalysisForm/AnalysisForm";
import { ResultsDisplay } from "@/components/ResultsDisplay/ResultsDisplay";

export default function HomePage() {
  return (
    // O container principal que usa nosso grid do CSS module
    <Box className={styles.pageContainer}>

      {/* Coluna da Esquerda: Formulário de Análise */}
      <Paper elevation={0} className={styles.column}>
        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          Criar Nova Análise
        </Typography>
        <AnalysisForm />
      </Paper>
      
      {/* Coluna da Direita: Resultados */}
      <Box className={styles.column}>
        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          Resultado
        </Typography>
        {/* O ResultsDisplay já tem seu próprio Paper/fundo */}
        <ResultsDisplay />
      </Box>

    </Box>
  );
}