"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { Box, Button, Typography, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const { history, fetchHistory, clearResult } = useAnalysisStore();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <Box component="aside" className={styles.sidebarContainer}>
      <Link href="/" passHref>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={clearResult}
          fullWidth
        >
          Nova Análise
        </Button>
      </Link>
      <Typography variant="h6" className={styles.historyTitle}>
        Histórico
      </Typography>
      <List className={styles.historyList}>
        {history.map((item) => (
          <ListItem key={item.id} disablePadding>
            <Link href={`/analysis/${item.id}`} passHref className={styles.link}>
              <ListItemButton>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}