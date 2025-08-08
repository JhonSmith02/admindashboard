import React from 'react';
import { 
  TableContainer, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Paper,
  Box,
  Button,
  Typography
} from '@mui/material';
import UserRow from './UsuarioRow';

const UserTable = ({ 
  users, 
  searchTerm, 
  handleOpenEditModal, 
  handleDelete, 
  setSearchTerm,
  filteredUsers,
  handleOpenCreateModal
}) => {
  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        borderTopLeftRadius: 0, 
        borderTopRightRadius: 0,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}
    >
      <Table sx={{ minWidth: 1000 }}>
        <TableHead>
          <TableRow sx={{ 
            bgcolor: '#f8f9fa',
            '& th': {
              fontWeight: 'bold',
              fontSize: '1rem',
              borderBottom: '2px solid #e0e0e0'
            }
          }}>
            <TableCell>Usuario</TableCell>
            <TableCell>Proyecto</TableCell>
            <TableCell>Tarea</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        
        <TableBody>
          {filteredUsers.map((user) => (
            <UserRow 
              key={user.id} 
              user={user} 
              handleOpenEditModal={handleOpenEditModal} 
              handleDelete={handleDelete} 
            />
          ))}
        </TableBody>
      </Table>
      
      {/* Mensaje cuando no hay resultados */}
      {filteredUsers.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron usuarios que coincidan con tu búsqueda
          </Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 2 }} 
            onClick={() => setSearchTerm('')}
          >
            Limpiar búsqueda
          </Button>
        </Box>
      )}
    </TableContainer>
  );
};

export default UserTable;