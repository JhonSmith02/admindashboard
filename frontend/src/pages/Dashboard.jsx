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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Delete, 
  Edit, 
  Person, 
  Assignment,
  Task,
  Add,
  Close
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
    }
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Desarrollador',
    project: '',
    task: '',
    status: 'Activo',
    avatarColor: getRandomColor()
  });

  // Generar color aleatorio para avatares
  function getRandomColor() {
    const colors = ['#ff6b6b', '#4ecdc4', '#ffbe0b', '#6a0572', '#1a936f', '#3a86ff'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Abrir modal para edición
  const handleOpenEditModal = (user) => {
    setCurrentUser({ ...user });
    setOpenModal(true);
  };

  // Abrir modal para creación
  const handleOpenCreateModal = () => {
    setCurrentUser(null);
    setNewUser({
      name: '',
      email: '',
      role: 'Desarrollador',
      project: '',
      task: '',
      status: 'Activo',
      avatarColor: getRandomColor()
    });
    setOpenModal(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Guardar cambios (tanto para edición como creación)
  const handleSave = () => {
    if (currentUser) {
      // Actualizar usuario existente
      setUsers(users.map(user => 
        user.id === currentUser.id ? currentUser : user
      ));
    } else {
      // Crear nuevo usuario
      const newUserWithId = {
        ...newUser,
        id: Math.max(...users.map(u => u.id), 0) + 1
      };
      setUsers([...users, newUserWithId]);
    }
    setOpenModal(false);
  };

  // Eliminar usuario
  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  // Manejar cambios en formulario de edición
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser(prev => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en formulario de creación
  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
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
          
          <Stack direction="row" spacing={2}>
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
            <Button 
              variant="contained" 
              startIcon={<Add />}
              onClick={handleOpenCreateModal}
              sx={{ height: 56 }}
            >
              Crear Usuario
            </Button>
          </Stack>
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
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                  
                  {/* Columna Acciones */}
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" spacing={1}>
                      <Tooltip title="Editar usuario">
                        <IconButton 
                          onClick={() => handleOpenEditModal(user)} 
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

      {/* Modal para edición/creación de usuarios */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {currentUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          <IconButton onClick={handleCloseModal}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers sx={{ pt: 2 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {currentUser ? (
              // Formulario de edición
              <>
                <TextField
                  label="Nombre completo"
                  name="name"
                  value={currentUser.name}
                  onChange={handleEditChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Email"
                  name="email"
                  value={currentUser.email}
                  onChange={handleEditChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Rol"
                  name="role"
                  value={currentUser.role}
                  onChange={handleEditChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Proyecto"
                  name="project"
                  value={currentUser.project}
                  onChange={handleEditChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Tarea"
                  name="task"
                  value={currentUser.task}
                  onChange={handleEditChange}
                  fullWidth
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Estado</InputLabel>
                  <Select
                    name="status"
                    value={currentUser.status}
                    onChange={handleEditChange}
                    label="Estado"
                  >
                    <MenuItem value="Activo">Activo</MenuItem>
                    <MenuItem value="Inactivo">Inactivo</MenuItem>
                    <MenuItem value="En vacaciones">En vacaciones</MenuItem>
                    <MenuItem value="En licencia">En licencia</MenuItem>
                  </Select>
                </FormControl>
              </>
            ) : (
              // Formulario de creación
              <>
                <TextField
                  label="Nombre completo"
                  name="name"
                  value={newUser.name}
                  onChange={handleCreateChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Email"
                  name="email"
                  value={newUser.email}
                  onChange={handleCreateChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Rol</InputLabel>
                  <Select
                    name="role"
                    value={newUser.role}
                    onChange={handleCreateChange}
                    label="Rol"
                  >
                    <MenuItem value="Desarrollador">Desarrollador</MenuItem>
                    <MenuItem value="Diseñador">Diseñador</MenuItem>
                    <MenuItem value="QA Tester">QA Tester</MenuItem>
                    <MenuItem value="Project Manager">Project Manager</MenuItem>
                    <MenuItem value="DevOps">DevOps</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Proyecto"
                  name="project"
                  value={newUser.project}
                  onChange={handleCreateChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Tarea"
                  name="task"
                  value={newUser.task}
                  onChange={handleCreateChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Estado</InputLabel>
                  <Select
                    name="status"
                    value={newUser.status}
                    onChange={handleCreateChange}
                    label="Estado"
                  >
                    <MenuItem value="Activo">Activo</MenuItem>
                    <MenuItem value="Inactivo">Inactivo</MenuItem>
                    <MenuItem value="En vacaciones">En vacaciones</MenuItem>
                    <MenuItem value="En licencia">En licencia</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseModal} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {currentUser ? 'Actualizar Usuario' : 'Crear Usuario'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;