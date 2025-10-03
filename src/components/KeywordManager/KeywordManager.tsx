// src/components/KeywordManager.tsx
"use client";

import { useMemo, useState } from 'react';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { Box, TextField, Button, Chip, Typography, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import StarBorderIcon from '@mui/icons-material/StarBorder'; // Ícone de estrela vazia
import StarIcon from '@mui/icons-material/Star'; // Ícone de estrela preenchida
import styles from './KeywordManager.module.css';
import { LibraryModal } from '../LibraryModal/LibraryModal';

export function KeywordManager() {
  const {
    currentKeywords,
    libraryKeywords,
    addKeyword,
    removeKeyword,
    saveKeywordToLibrary // Nossa nova ação do store
  } = useAnalysisStore();
  
  const [inputValue, setInputValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Para otimização, criamos um Set com as palavras da biblioteca
  // Isso evita percorrer o array toda vez que renderizamos um chip.
  const libraryKeywordsSet = useMemo(() =>
    new Set(libraryKeywords.map(k => k.keyword.toLowerCase())),
    [libraryKeywords]
  );

  const handleAddKeyword = () => {
    addKeyword(inputValue);
    setInputValue('');
  };

  return (
    <Box className={styles.container}>
      <Typography variant="subtitle1" gutterBottom>
        Palavras-Chave
      </Typography>
      <Box className={styles.inputArea}>
        <TextField
          label="Adicionar palavra-chave"
          variant="outlined"
          size="small"
          fullWidth
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
        />
        <Button variant="contained" onClick={handleAddKeyword} className={styles.addButton}>
          <AddIcon />
        </Button>
      </Box>
      <Button
        variant="outlined"
        startIcon={<LibraryAddIcon />}
        onClick={() => setIsModalOpen(true)}
        className={styles.importButton}
      >
        Importar da Biblioteca
      </Button>
      <Box className={styles.chipContainer}>
        {currentKeywords.map((keyword) => {
          const isSaved = libraryKeywordsSet.has(keyword.toLowerCase());
          return (
            <Box key={keyword} className={styles.chipWrapper}>
              <Chip
                label={keyword}
                onDelete={() => removeKeyword(keyword)}
                className={styles.chip}
              />
              <Tooltip title={isSaved ? "Salva na biblioteca" : "Salvar na biblioteca"}>
                {/* O IconButton fica desabilitado se a palavra já foi salva */}
                <span> {/* O <span> é necessário para o Tooltip funcionar em botões desabilitados */}
                  <IconButton
                    size="small"
                    onClick={() => saveKeywordToLibrary(keyword)}
                    disabled={isSaved}
                    color="primary"
                  >
                    {isSaved ? <StarIcon /> : <StarBorderIcon />}
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          );
        })}
      </Box>

      <LibraryModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
}