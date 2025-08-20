import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Box,
  Typography,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Button,
} from "@mui/material";
import { Assignment, Task, Edit, Delete } from "@mui/icons-material";

const UserTable = ({
  users,
  onEdit,
  onDelete,
  searchTerm,
  setSearchTerm,
}) => {
  // Filtrar usuarios según búsqueda
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.task.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
      >
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f8f9fa" }}>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                Usuario
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                Rol
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                Proyecto
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                Tarea
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                Estado
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", fontSize: "1rem", textAlign: "center" }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} hover>
                {/* Usuario */}
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{
                        bgcolor: user.avatarColor,
                        mr: 2,
                        width: 40,
                        height: 40,
                      }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        {user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                {/* Rol */}
                <TableCell>
                  <Chip
                    label={user.role}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: "bold" }}
                  />
                </TableCell>

                {/* Proyecto */}
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Assignment sx={{ color: "primary.main", mr: 1 }} />
                    <Typography>{user.project}</Typography>
                  </Box>
                </TableCell>

                {/* Tarea */}
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Task sx={{ color: "secondary.main", mr: 1 }} />
                    <Typography>{user.task}</Typography>
                  </Box>
                </TableCell>

                {/* Estado */}
                <TableCell>
                  <Chip
                    label={user.status}
                    color={user.status === "Activo" ? "success" : "warning"}
                    variant="outlined"
                    sx={{ fontWeight: "bold" }}
                  />
                </TableCell>

                {/* Acciones */}
                <TableCell align="center">
                  <Stack direction="row" justifyContent="center" spacing={1}>
                    <Tooltip title="Editar usuario">
                      <IconButton
                        onClick={() => onEdit(user)}
                        color="primary"
                        sx={{
                          bgcolor: "rgba(52, 152, 219, 0.1)",
                          "&:hover": {
                            bgcolor: "rgba(52, 152, 219, 0.2)",
                          },
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar usuario">
                      <IconButton
                        onClick={() => onDelete(user)}
                        color="error"
                        sx={{
                          bgcolor: "rgba(231, 76, 60, 0.1)",
                          "&:hover": {
                            bgcolor: "rgba(231, 76, 60, 0.2)",
                          },
                        }}
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
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron usuarios que coincidan con tu búsqueda
          </Typography>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => setSearchTerm("")}
          >
            Limpiar búsqueda
          </Button>
        </Box>
      )}
    </>
  );
};

export default UserTable;
