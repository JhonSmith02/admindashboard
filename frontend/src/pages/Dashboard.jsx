import React, { useState, useEffect } from 'react';
import BackgroundAnimado from '../components/dashboard/BackgroundAnimado';
import DashboardHeader from '../components/DashboardHeader';
import UserTable from '../components/dashboard/UserTable';

import {
  Box,
  Container,
  Typography,
  Paper,
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
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Delete,
  Edit,
  Person,
  Assignment,
  Task,
  Add,
  Close,
  Warning,
  Group,
  Category
} from '@mui/icons-material';

const Dashboard = ({ user, setUser }) => {
  // Estados principales
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para modales
  const [openModal, setOpenModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rolesModalOpen, setRolesModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para nuevo rol
  const [newRole, setNewRole] = useState('');

  // Estado para nuevo usuario
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    project: '',
    task: '',
    status: 'Activo',
    avatarColor: ''
  });

  // Token de autenticación
  const token = localStorage.getItem('token');

  // Función para hacer peticiones autenticadas
  const fetchWithAuth = async (url, options = {}) => {
    const response = await fetch(`http://localhost:4000${url}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error ${response.status}`);
    }

    return response.json();
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Cargar usuarios
      const usersData = await fetchWithAuth('/api/users');
      
      // Transformar datos para que coincidan con el formato esperado
      const transformedUsers = usersData.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        project: 'Sin asignar', // Agregar lógica para proyectos si existe en BD
        task: 'Sin asignar', // Agregar lógica para tareas si existe en BD
        status: user.status || 'Activo',
        avatarColor: user.avatar_color || getRandomColor(),
      }));

      setUsers(transformedUsers);

      // Extraer roles únicos de los usuarios
      const uniqueRoles = [...new Set(usersData.map(user => user.role).filter(Boolean))];
      setRoles(uniqueRoles);

    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los datos. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

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
      role: roles[0] || 'user',
      project: '',
      task: '',
      status: 'Activo',
      avatarColor: getRandomColor()
    });
    setOpenModal(true);
  };

  // Abrir modal de roles
  const handleOpenRolesModal = () => {
    setRolesModalOpen(true);
  };

  // Cerrar modales
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleCloseRolesModal = () => {
    setRolesModalOpen(false);
    setNewRole('');
  };

  // Guardar cambios (tanto para edición como creación)
  const handleSave = async () => {
    try {
      if (currentUser) {
        // Actualizar usuario existente
        await fetchWithAuth(`/api/users/${currentUser.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: currentUser.name,
            email: currentUser.email,
            role: currentUser.role,
            status: currentUser.status,
          }),
        });

        // Actualizar estado local
        setUsers(users.map(user =>
          user.id === currentUser.id ? currentUser : user
        ));
      } else {
        // Crear nuevo usuario
        const createdUser = await fetchWithAuth('/api/users', {
          method: 'POST',
          body: JSON.stringify({
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            status: newUser.status,
            avatar_color: newUser.avatarColor,
          }),
        });

        // Agregar a la lista local
        const newUserWithFormat = {
          ...newUser,
          id: createdUser.id,
          role: createdUser.role,
        };
        setUsers([...users, newUserWithFormat]);
      }

      setOpenModal(false);
      // Recargar datos para mantener consistencia
      // loadInitialData();
    } catch (err) {
      console.error('Error guardando usuario:', err);
      setError('Error al guardar el usuario');
    }
  };

  // Agregar nuevo rol
  const handleAddRole = () => {
    if (newRole.trim() && !roles.includes(newRole.trim())) {
      setRoles([...roles, newRole.trim()]);
      setNewRole('');
    }
  };

  // Eliminar rol
  const handleDeleteRole = (roleToDelete) => {
    // Verificar si el rol está en uso
    const isRoleInUse = users.some(user => user.role === roleToDelete);

    if (isRoleInUse) {
      alert('Este rol está en uso y no puede ser eliminado');
      return;
    }

    setRoles(roles.filter(role => role !== roleToDelete));
  };

  // Abrir modal de confirmación para eliminar usuario
  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  // Confirmar eliminación de usuario
  const confirmDelete = async () => {
    try {
      await fetchWithAuth(`/api/users/${userToDelete.id}`, {
        method: 'DELETE',
      });

      setUsers(users.filter(user => user.id !== userToDelete.id));
      setDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Error eliminando usuario:', err);
      setError('Error al eliminar el usuario');
    }
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

  // Mostrar loading
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <BackgroundAnimado />

      <Container maxWidth={false} disableGutters sx={{ width: '100%', py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <DashboardHeader
            totalUsers={users.length}
            activeUsers={users.filter((u) => u.status === "Activo").length}
            rolesCount={roles.length}
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onOpenRoles={handleOpenRolesModal}
            onOpenCreate={handleOpenCreateModal}
          />

          {/* Tabla de Usuarios */}
          <UserTable
            users={users}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

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
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Rol</InputLabel>
                    <Select
                      name="role"
                      value={currentUser.role}
                      onChange={handleEditChange}
                      label="Rol"
                    >
                      {roles.map((role, index) => (
                        <MenuItem key={index} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                      {roles.map((role, index) => (
                        <MenuItem key={index} value={role}>
                          {role}
                        </MenuItem>
                      ))}
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

        {/* Modal de confirmación para eliminar usuario */}
        <Dialog
          open={deleteModalOpen}
          onClose={handleCloseDeleteModal}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
            <Warning sx={{ color: 'error.main', mr: 1 }} />
            Confirmar eliminación
          </DialogTitle>

          <DialogContent dividers>
            <Typography variant="body1" sx={{ mb: 2 }}>
              ¿Estás seguro de que deseas eliminar al usuario?
            </Typography>
            {userToDelete && (
              <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f8f9fa', p: 2, borderRadius: 1 }}>
                <Avatar sx={{ bgcolor: userToDelete.avatarColor, mr: 2 }}>
                  {userToDelete.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {userToDelete.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {userToDelete.email}
                  </Typography>
                  <Chip
                    label={userToDelete.role}
                    color="primary"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
            )}
            <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 'bold' }}>
              Esta acción no se puede deshacer
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={handleCloseDeleteModal}
              variant="outlined"
              color="inherit"
              sx={{ mr: 1 }}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmDelete}
              variant="contained"
              color="error"
              startIcon={<Delete />}
            >
              Eliminar definitivamente
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal para gestión de roles */}
        <Dialog
          open={rolesModalOpen}
          onClose={handleCloseRolesModal}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Category sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">Gestión de Roles</Typography>
            </Box>
            <IconButton onClick={handleCloseRolesModal}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Agrega nuevos roles o elimina los existentes. Los roles en uso no pueden ser eliminados.
            </Typography>

            {/* Formulario para agregar roles */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <TextField
                label="Nuevo rol"
                fullWidth
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddRole()}
              />
              <Button
                variant="contained"
                onClick={handleAddRole}
                disabled={!newRole.trim()}
                sx={{ height: 56 }}
              >
                Agregar
              </Button>
            </Box>

            {/* Lista de roles existentes */}
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Roles Existentes ({roles.length})
            </Typography>

            <List sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid #eee', borderRadius: 1 }}>
              {roles.map((role, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    secondaryAction={
                      <Tooltip title="Eliminar rol">
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteRole(role)}
                          disabled={users.some(user => user.role === role)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    }
                  >
                    <ListItemText
                      primary={role}
                      secondary={users.some(user => user.role === role) ? "En uso" : "Disponible"}
                    />
                  </ListItem>
                  {index < roles.length - 1 && <Divider />}
                </React.Fragment>
              ))}

              {roles.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="No hay roles creados"
                    secondary="Comienza agregando un nuevo rol"
                  />
                </ListItem>
              )}
            </List>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={handleCloseRolesModal}
              variant="outlined"
              color="inherit"
            >
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Dashboard;