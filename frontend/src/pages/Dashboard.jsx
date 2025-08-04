// src/pages/dashboard.jsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  Avatar,
  Stack,
  Chip,
  Tooltip
} from '@mui/material';
import { 
  Delete, 
  Edit, 
  Save, 
  Cancel, 
  Person, 
  Assignment,
  Task 
} from '@mui/icons-material';

const Dashboard = () => {
  // Estado inicial de usuarios
  const [users, setUsers] = useState([
    { 
      id: 1, 
      name: 'Ana López', 
      email: 'ana.lopez@empresa.com',
      role: 'Desarrollador Frontend',
      project: 'Desarrollo Web', 
      task: 'Diseño UI',
      status: 'Activo',
      avatarColor: '#ff6b6b'
    },
    { 
      id: 2, 
      name: 'Carlos Ruiz', 
      email: 'carlos.ruiz@empresa.com',
      role: 'QA Tester',
      project: 'App Móvil', 
      task: 'Pruebas QA',
      status: 'Activo',
      avatarColor: '#4ecdc4'
    },
    { 
      id: 3, 
      name: 'Marta Vidal', 
      email: 'marta.vidal@empresa.com',
      role: 'DBA',
      project: 'Base de Datos', 
      task: 'Optimización',
      status: 'Activo',
      avatarColor: '#ffbe0b'
    },
    { 
      id: 4, 
      name: 'Jorge Martínez', 
      email: 'jorge.martinez@empresa.com',
      role: 'DevOps',
      project: 'Infraestructura', 
      task: 'Implementación CI/CD',
      status: 'En vacaciones',
      avatarColor: '#6a0572'
    },
    { 
      id: 5, 
      name: 'Lucía Fernández', 
      email: 'lucia.fernandez@empresa.com',
      role: 'Project Manager',
      project: 'Gestión de Proyectos', 
      task: 'Planificación Sprint',
      status: 'Activo',
      avatarColor: '#1a936f'
    }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ project: '', task: '' });
  const [searchTerm, setSearchTerm] = useState('');

  // Manejar edición
  const handleEditClick = (user) => {
    setEditingId(user.id);
    setEditData({ project: user.project, task: user.task });
  };

  // Guardar cambios
  const handleSaveClick = (id) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, project: editData.project, task: editData.task } : user
    ));
    setEditingId(null);
  };

  // Cancelar edición
  const handleCancelClick = () => {
    setEditingId(null);
  };

  // Eliminar usuario
  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  // Actualizar campos editables
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  // Filtrar usuarios por búsqueda
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.task.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Encabezado del Dashboard */}
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

        {/* Estadísticas y Búsqueda */}
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f8f9fa' }}>
          <Stack direction="row" spacing={2}>
            <Paper sx={{ p: 2, minWidth: 180, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">Total Usuarios</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>{users.length}</Typography>
            </Paper>
            <Paper sx={{ p: 2, minWidth: 180, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">Activos</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }} color="success.main">
                {users.filter(u => u.status === 'Activo').length}
              </Typography>
            </Paper>
          </Stack>
          
          <TextField
            variant="outlined"
            placeholder="Buscar usuarios, proyectos o tareas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 350 }}
            InputProps={{
              startAdornment: (
                <Box sx={{ color: 'action.active', mr: 1 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </Box>
              ),
            }}
          />
        </Box>

        {/* Tabla de Usuarios */}
        <TableContainer component={Paper} sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Usuario</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Proyecto</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Tarea</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', textAlign: 'center' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  {/* Columna Usuario */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: user.avatarColor, mr: 2, width: 40, height: 40 }}>
                        {user.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                        <Typography variant="body2" color="text.secondary">{user.role}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  {/* Columna Proyecto (editable) */}
                  <TableCell>
                    {editingId === user.id ? (
                      <TextField
                        name="project"
                        value={editData.project}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <Assignment sx={{ color: 'action.active', mr: 1 }} />
                          ),
                        }}
                      />
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Assignment sx={{ color: 'primary.main', mr: 1 }} />
                        <Typography>{user.project}</Typography>
                      </Box>
                    )}
                  </TableCell>
                  
                  {/* Columna Tarea (editable) */}
                  <TableCell>
                    {editingId === user.id ? (
                      <TextField
                        name="task"
                        value={editData.task}
                        onChange={handleChange}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <Task sx={{ color: 'action.active', mr: 1 }} />
                          ),
                        }}
                      />
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Task sx={{ color: 'secondary.main', mr: 1 }} />
                        <Typography>{user.task}</Typography>
                      </Box>
                    )}
                  </TableCell>
                  
                  {/* Columna Estado */}
                  <TableCell>
                    <Chip 
                      label={user.status} 
                      color={user.status === 'Activo' ? 'success' : 'warning'} 
                      variant="outlined"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                  
                  {/* Columna Acciones */}
                  <TableCell align="center">
                    {editingId === user.id ? (
                      <Stack direction="row" justifyContent="center" spacing={1}>
                        <Tooltip title="Guardar cambios">
                          <IconButton 
                            onClick={() => handleSaveClick(user.id)} 
                            color="success"
                            sx={{ bgcolor: 'rgba(46, 204, 113, 0.1)', '&:hover': { bgcolor: 'rgba(46, 204, 113, 0.2)' } }}
                          >
                            <Save />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancelar edición">
                          <IconButton 
                            onClick={handleCancelClick} 
                            color="warning"
                            sx={{ bgcolor: 'rgba(241, 196, 15, 0.1)', '&:hover': { bgcolor: 'rgba(241, 196, 15, 0.2)' } }}
                          >
                            <Cancel />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    ) : (
                      <Stack direction="row" justifyContent="center" spacing={1}>
                        <Tooltip title="Editar asignación">
                          <IconButton 
                            onClick={() => handleEditClick(user)} 
                            color="primary"
                            sx={{ bgcolor: 'rgba(52, 152, 219, 0.1)', '&:hover': { bgcolor: 'rgba(52, 152, 219, 0.2)' } }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar usuario">
                          <IconButton 
                            onClick={() => handleDelete(user.id)} 
                            color="error"
                            sx={{ bgcolor: 'rgba(231, 76, 60, 0.1)', '&:hover': { bgcolor: 'rgba(231, 76, 60, 0.2)' } }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Mensaje cuando no hay resultados */}
        {filteredUsers.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No se encontraron usuarios que coincidan con tu búsqueda
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setSearchTerm('')}>
              Limpiar búsqueda
            </Button>
          </Box>
        )}
      </Paper>

      {/* Pie de página */}
      <Box sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2">
          Panel de Gestión • Versión 1.0 • {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
      </Box>
    </Container>
  );
};

export default Dashboard;