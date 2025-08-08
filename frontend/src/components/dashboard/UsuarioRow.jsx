import React from 'react';
import { 
  TableRow, 
  TableCell, 
  Box, 
  Avatar, 
  Typography, 
  Chip, 
  Stack, 
  IconButton, 
  Tooltip 
} from '@mui/material';
import { Edit, Delete, Assignment, Task } from '@mui/icons-material';

const UsuarioRow = ({ 
  user,
  handleOpenEditModal,
  handleDelete 
}) => {
  return (
    <TableRow hover sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
      {/* Columna Usuario */}
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ 
            bgcolor: user.avatarColor, 
            mr: 2, 
            width: 40, 
            height: 40,
            fontWeight: 'bold',
            color: 'white'
          }}>
            {user.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
            <Typography variant="body2" color="text.secondary">{user.role}</Typography>
          </Box>
        </Box>
      </TableCell>
      
      {/* Columna Proyecto */}
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Assignment sx={{ color: 'primary.main', mr: 1 }} />
          <Typography>{user.project}</Typography>
        </Box>
      </TableCell>
      
      {/* Columna Tarea */}
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Task sx={{ color: 'secondary.main', mr: 1 }} />
          <Typography>{user.task}</Typography>
        </Box>
      </TableCell>
      
      {/* Columna Estado */}
      <TableCell>
        <Chip 
          label={user.status} 
          color={user.status === 'Activo' ? 'success' : 'warning'} 
          variant="outlined"
          sx={{ 
            fontWeight: 'bold',
            borderWidth: '2px'
          }}
        />
      </TableCell>
      
      {/* Columna Acciones */}
      <TableCell align="center">
        <Stack direction="row" justifyContent="center" spacing={1}>
          <Tooltip title="Editar usuario">
            <IconButton 
              onClick={() => handleOpenEditModal(user)} 
              color="primary"
              sx={{ 
                bgcolor: 'rgba(52, 152, 219, 0.1)', 
                '&:hover': { 
                  bgcolor: 'rgba(52, 152, 219, 0.2)',
                  transform: 'scale(1.1)'
                },
                transition: 'transform 0.2s'
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar usuario">
            <IconButton 
              onClick={() => handleDelete(user.id)} 
              color="error"
              sx={{ 
                bgcolor: 'rgba(231, 76, 60, 0.1)', 
                '&:hover': { 
                  bgcolor: 'rgba(231, 76, 60, 0.2)',
                  transform: 'scale(1.1)'
                },
                transition: 'transform 0.2s'
              }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

export default UsuarioRow;