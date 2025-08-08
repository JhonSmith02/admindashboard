import React from 'react';
import { Box, Typography } from '@mui/material';

const DashboardFooter = () => {
  return (
    <Box sx={{ 
      mt: 3, 
      textAlign: 'center', 
      color: 'text.secondary',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      p: 2,
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      <Typography variant="body2">
        Panel de Gestión • Versión 1.0 • {new Date().toLocaleDateString('es-ES', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </Typography>
    </Box>
  );
};

export default DashboardFooter;