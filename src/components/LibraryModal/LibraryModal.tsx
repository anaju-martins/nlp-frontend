"use client";

import { useEffect, useState } from 'react';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  List, ListItem, ListItemButton, Checkbox, ListItemText, CircularProgress, Box // 1. Importe ListItemButton
} from '@mui/material';

export function LibraryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { libraryKeywords, fetchLibraryKeywords, addKeyword } = useAnalysisStore();
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      fetchLibraryKeywords().finally(() => setIsLoading(false));
    }
  }, [open, fetchLibraryKeywords]);

  const handleToggle = (keyword: string) => {
    const currentIndex = selected.indexOf(keyword);
    const newSelected = [...selected];

    if (currentIndex === -1) {
      newSelected.push(keyword);
    } else {
      newSelected.splice(currentIndex, 1);
    }
    setSelected(newSelected);
  };

  const handleConfirm = () => {
    selected.forEach(keyword => addKeyword(keyword));
    setSelected([]);
    onClose();
  };
  
  const handleCancel = () => {
    setSelected([]);
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="xs">
      <DialogTitle>Importar da Biblioteca</DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {libraryKeywords.map(({ id, keyword }) => (
              // 2. Remova a prop "button" e o onClick daqui
              <ListItem key={id} disablePadding> 
                {/* 3. Envolva o conteúdo com ListItemButton e mova o onClick para cá */}
                <ListItemButton dense onClick={() => handleToggle(keyword)}>
                  <Checkbox
                    edge="start"
                    checked={selected.indexOf(keyword) !== -1}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={keyword} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancelar</Button>
        <Button onClick={handleConfirm} variant="contained" disabled={selected.length === 0}>
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
}