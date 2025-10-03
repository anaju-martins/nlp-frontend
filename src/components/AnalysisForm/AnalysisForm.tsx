"use client";

import { useState } from 'react';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import styles from './AnalysisForm.module.css';
import { KeywordManager } from '../KeywordManager/KeywordManager';

export function AnalysisForm() {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const { runAnalysis, isLoading } = useAnalysisStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      alert("Por favor, preencha o nome e o texto da análise.");
      return;
    }
    runAnalysis(name, text);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className={styles.formContainer}>
      <TextField
        label="Nome da Análise"
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <KeywordManager />
      <TextField
        label="Cole o texto para ser analisado aqui..."
        variant="outlined"
        fullWidth
        multiline
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        // --- MUDANÇA PRINCIPAL AQUI ---
        sx={{
          flexGrow: 1, // Garante que o campo ocupe o espaço vertical restante
          minHeight: 0, // Um "truque" do flexbox para permitir que o item encolha corretamente
          '& .MuiInputBase-root': {
            height: '100%', // Força o contêiner do input a ter 100% da altura disponível
          },
          // Aplica a barra de rolagem diretamente no elemento <textarea> interno
          '& .MuiInputBase-inputMultiline': {
            overflowY: 'auto !important',
            height: '100% !important',
          }
        }}
      />
      <Button
        type="submit"
        variant="contained"
        size="large"
        endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
        disabled={isLoading}
      >
        {isLoading ? "Analisando..." : "Analisar Texto"}
      </Button>
    </Box>
  );
}