import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  IconButton, 
  Stack, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';
import { Close } from '@mui/icons-material';

const UserModal = ({ 
  openModal, 
  handleCloseModal, 
  currentUser, 
  newUser, 
  handleEditChange, 
  handleCreateChange, 
  handleSave 
}) => {
  return (
    <Dialog 
      open={openModal} 
      onClose={handleCloseModal} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: '12px' } }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: 'primary.main',
        color: 'white',
        fontWeight: 'bold'
      }}>
        {currentUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        <IconButton onClick={handleCloseModal} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ pt: 2, bgcolor: '#fafafa' }}>
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
                variant="outlined"
              />
              <TextField
                label="Email"
                name="email"
                value={currentUser.email}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Rol"
                name="role"
                value={currentUser.role}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Proyecto"
                name="project"
                value={currentUser.project}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Tarea"
                name="task"
                value={currentUser.task}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <FormControl fullWidth margin="normal" variant="outlined">
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
                variant="outlined"
                required
              />
              <TextField
                label="Email"
                name="email"
                value={newUser.email}
                onChange={handleCreateChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
              <FormControl fullWidth margin="normal" variant="outlined">
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
                variant="outlined"
                required
              />
              <TextField
                label="Tarea"
                name="task"
                value={newUser.task}
                onChange={handleCreateChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
              />
              <FormControl fullWidth margin="normal" variant="outlined">
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
      
      <DialogActions sx={{ p: 3, bgcolor: '#f5f5f5' }}>
        <Button 
          onClick={handleCloseModal} 
          variant="outlined" 
          color="inherit"
          sx={{ 
            borderRadius: '8px',
            fontWeight: 'bold',
            px: 3,
            py: 1
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          sx={{ 
            borderRadius: '8px',
            fontWeight: 'bold',
            px: 3,
            py: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          {currentUser ? 'Actualizar Usuario' : 'Crear Usuario'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserModal;