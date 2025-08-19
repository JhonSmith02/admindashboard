// src/pages/UserView.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Container,
  Avatar,
  Stack,
  Chip,
  ListItemAvatar,
  Divider,
  IconButton,
  Button,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircleOutline,
  RadioButtonUnchecked,
  CalendarToday,
  WorkOutline,
} from '@mui/icons-material';

export default function UserView({ user }) {
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      console.warn('No token found in localStorage');
      return;
    }

    const load = async () => {
      try {
        const resProfile = await fetch('http://localhost:4000/api/users/me', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!resProfile.ok) {
          const err = await resProfile.json();
          console.error('Error /me', err);
        } else {
          const dataProfile = await resProfile.json();
          setProfile(dataProfile);
        }
      } catch (err) {
        console.error('Error cargando perfil', err);
      }

      try {
        const resTasks = await fetch('http://localhost:4000/api/tasks/my', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!resTasks.ok) {
          const err = await resTasks.json();
          console.error('Error /tasks/my', err);
        } else {
          const dataTasks = await resTasks.json();
          setTasks(dataTasks);
        }
      } catch (err) {
        console.error('Error cargando tareas', err);
      }
    };

    load();
  }, [token]);

  // --- helpers / UI-only logic (no cambia fetch ni persistencia) ---

  // progreso % calculado desde las tareas en estado local
  const progress = useMemo(() => {
    if (!tasks || tasks.length === 0) return 0;
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completada').length;
    return Math.round((completed / total) * 100);
  }, [tasks]);

  // toggle local del estado de una tarea (no persiste por ahora)
  const toggleComplete = (taskId) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: t.status === 'Completada' ? 'Pendiente' : 'Completada' } : t))
    );
    // Nota: En producción llamarías al backend para persistir este cambio.
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

  // --- render ---
  if (!profile) return <Typography sx={{ p: 4 }}>Cargando perfil...</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: profile.avatarColor || '#3a86ff' }}>
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <div>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{profile.name}</Typography>
              <Chip label={`Rol: ${profile.role}`} size="small" sx={{ mt: 1 }} />
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

        {(!tasks || tasks.length === 0) ? (
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
                          onClick={() => alert(`Detalle: ${task.title}\nProyecto: ${task.project || '—'}`)}
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

                          <Typography variant="caption" color="text.secondary">Proyecto: {task.project || '—'}</Typography>
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
