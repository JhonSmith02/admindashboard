// dashboard.jsx
import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    IconButton,
    Typography,
    Box
} from '@mui/material';
import { Delete, Edit, Save, Cancel } from '@mui/icons-material';

const Dashboard = () => {
    // Estado inicial de usuarios
    const [users, setUsers] = useState([
        { id: 1, name: 'Ana López', project: 'Desarrollo Web', task: 'Diseño UI' },
        { id: 2, name: 'Carlos Ruiz', project: 'App Móvil', task: 'Pruebas QA' },
        { id: 3, name: 'Marta Vidal', project: 'Base de Datos', task: 'Optimización' }
    ]);

    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ project: '', task: '' });

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

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Panel de Usuarios
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Proyecto</TableCell>
                            <TableCell>Tarea</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>

                                {/* Campo de proyecto (editable) */}
                                <TableCell>
                                    {editingId === user.id ? (
                                        <TextField
                                            name="project"
                                            value={editData.project}
                                            onChange={handleChange}
                                            size="small"
                                            fullWidth
                                        />
                                    ) : (
                                        user.project
                                    )}
                                </TableCell>

                                {/* Campo de tarea (editable) */}
                                <TableCell>
                                    {editingId === user.id ? (
                                        <TextField
                                            name="task"
                                            value={editData.task}
                                            onChange={handleChange}
                                            size="small"
                                            fullWidth
                                        />
                                    ) : (
                                        user.task
                                    )}
                                </TableCell>

                                {/* Botones de acción */}
                                <TableCell>
                                    {editingId === user.id ? (
                                        <>
                                            <IconButton onClick={() => handleSaveClick(user.id)} color="primary">
                                                <Save />
                                            </IconButton>
                                            <IconButton onClick={handleCancelClick} color="secondary">
                                                <Cancel />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <>
                                            <IconButton onClick={() => handleEditClick(user)} color="primary">
                                                <Edit />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(user.id)} color="error">
                                                <Delete />
                                            </IconButton>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {users.length === 0 && (
                <Typography variant="body1" sx={{ textAlign: 'center', padding: 2 }}>
                    No hay usuarios registrados
                </Typography>
            )}
        </Box>
    );
};

export default Dashboard;