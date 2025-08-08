import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { Person } from '@mui/icons-material';

const DashboardHeader = () => {
  return (
    <Box sx={{ 
      bgcolor: 'primary.main', 
      color: 'white', 
      p: 3, 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Panel de Gestión de Usuarios
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 1 }}>
          Administra los usuarios, sus proyectos y tareas asignadas
        </Typography>
      </Box>
      <Avatar sx={{ bgcolor: 'white', color: 'primary.main', width: 56, height: 56 }}>
        <Person sx={{ fontSize: 32 }} />
      </Avatar>
    </Box>
  );
};

export default DashboardHeader;