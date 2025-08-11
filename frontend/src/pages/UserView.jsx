// UserView.jsx
import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  Button,
  Box,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircleOutline,
  RadioButtonUnchecked,
  CalendarToday,
  WorkOutline,
} from '@mui/icons-material';

/**
 * Componente: UserView
 * - Prop opcional: user (objeto con id, name, role, tasks[])
 * - Si no se pasa user, se usan ejemplos (mock) embebidos.
 *
 * Estructura de task: { id, title, project, dueDate (ISO string), status: 'Pendiente'|'En progreso'|'Completada' }
 *
 * Estado: manejo local de cambios de estado de tareas (ideal para conectar con API luego).
 */

export default function UserView({ user: userProp = null }) {
  // Mock de ejemplo si no se suministra userProp
  const exampleUser = {
    id: 42,
    name: 'María Gómez',
    role: 'operador',
    avatarColor: '#1565c0',
    tasks: [
      { id: 1, title: 'Checklist diario del catamarán', project: 'Operaciones', dueDate: '2025-08-12', status: 'En progreso' },
      { id: 2, title: 'Subir reporte de ventas', project: 'Comercial', dueDate: '2025-08-14', status: 'Pendiente' },
      { id: 3, title: 'Revisar inventario de seguridad', project: 'Logística', dueDate: '2025-08-20', status: 'Pendiente' },
      { id: 4, title: 'Actualizar bitácora cliente', project: 'Atención', dueDate: '2025-08-10', status: 'Completada' },
    ],
  };

  const user = userProp || exampleUser;

  // estado local para tareas (clonamos para evitar mutar props)
  const [tasks, setTasks] = useState(() => (user.tasks || []).map(t => ({ ...t })));

  // cálculo de progreso (porcentaje de tareas completadas)
  const progress = useMemo(() => {
    if (!tasks.length) return 0;
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completada').length;
    // cálculo: (completed / total) * 100
    return Math.round((completed / total) * 100);
  }, [tasks]);

  const toggleComplete = (taskId) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: t.status === 'Completada' ? 'Pendiente' : 'Completada' } : t))
    );
    // En producción aquí emitirías una llamada al backend para persistir el cambio.
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: user.avatarColor || '#3a86ff' }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <div>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{user.name}</Typography>
              <Chip label={`Rol: ${user.role}`} size="small" sx={{ mt: 1 }} />
            </div>
          </Stack>

          <Box sx={{ width: { xs: '100%', sm: 320 } }}>
            <Typography variant="caption" color="text.secondary">Progreso de tareas</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Box sx={{ flex: 1 }}>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 2 }} />
              </Box>
              <Typography variant="body2" sx={{ minWidth: 40 }}>{progress}%</Typography>
            </Box>
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Tareas asignadas</Typography>

        {tasks.length === 0 ? (
          <Typography color="text.secondary">No tienes tareas asignadas.</Typography>
        ) : (
          <List disablePadding>
            {tasks.map(task => {
              const isCompleted = task.status === 'Completada';
              return (
                <Paper key={task.id} elevation={0} sx={{ mb: 1, p: 1.25, borderRadius: 1, bgcolor: 'action.selected' }}>
                  <ListItem
                    secondaryAction={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton
                          edge="end"
                          aria-label={isCompleted ? 'Marcar pendiente' : 'Marcar completada'}
                          onClick={() => toggleComplete(task.id)}
                          size="small"
                        >
                          {isCompleted ? <CheckCircleOutline color="success" /> : <RadioButtonUnchecked />}
                        </IconButton>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => alert(`Detalle: ${task.title}\nProyecto: ${task.project}`)}
                        >
                          Ver
                        </Button>
                      </Stack>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#424242' }}>
                        <WorkOutline />
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography sx={{ fontWeight: 600 }}>{task.title}</Typography>
                          <Chip
                            label={task.status}
                            size="small"
                            color={isCompleted ? 'success' : (task.status === 'En progreso' ? 'warning' : 'default')}
                          />
                        </Stack>
                      }
                      secondary={
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <CalendarToday fontSize="small" />
                            <Typography variant="caption" color="text.secondary">{formatDate(task.dueDate)}</Typography>
                          </Stack>

                          <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: 'none', sm: 'block' } }} />

                          <Typography variant="caption" color="text.secondary">Proyecto: {task.project}</Typography>
                        </Stack>
                      }
                    />
                  </ListItem>
                </Paper>
              );
            })}
          </List>
        )}
      </Paper>
    </Container>
  );
}

UserView.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    role: PropTypes.string,
    avatarColor: PropTypes.string,
    tasks: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.any,
      title: PropTypes.string,
      project: PropTypes.string,
      dueDate: PropTypes.string,
      status: PropTypes.string,
    })),
  }),
};
