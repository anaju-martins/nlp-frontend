"use client";

import { useAnalysisStore } from "@/store/useAnalysisStore";
import { Box, Paper, Typography, CircularProgress } from "@mui/material";
// 1. Apenas a importação da nova biblioteca é necessária
import { JsonViewer } from "@textea/json-viewer";

export function ResultsDisplay() {
  const { analysisResult, isLoading } = useAnalysisStore();

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%', overflowY: 'auto', backgroundColor: '#fdfdfd' }}>
      {isLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Processando sua análise...</Typography>
        </Box>
      )}
      {!isLoading && !analysisResult && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography color="text.secondary">
            O resultado da sua análise aparecerá aqui.
          </Typography>
        </Box>
      )}
      {!isLoading && analysisResult && (
         // 2. Propriedades ajustadas para o @textea/json-viewer
         <JsonViewer 
            value={analysisResult} 
            theme="light"
            displayDataTypes={false}
            rootName={false}
         />
      )}
    </Paper>
  );
}