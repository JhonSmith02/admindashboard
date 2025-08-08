import React from 'react';
import { Paper, Typography } from '@mui/material';

const StatsCard = ({ title, value, color }) => {
  return (
    <Paper sx={{ 
      p: 2, 
      minWidth: 180, 
      textAlign: 'center',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <Typography variant="h6" color="text.secondary">{title}</Typography>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 'bold', 
          mt: 1,
          color: color || 'inherit'
        }}
      >
        {value}
      </Typography>
    </Paper>
  );
};

export default StatsCard;