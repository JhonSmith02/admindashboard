import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import { Person, Group, Add } from "@mui/icons-material";

const DashboardHeader = ({
  totalUsers,
  activeUsers,
  rolesCount,
  searchTerm,
  onSearchChange,
  onOpenRoles,
  onOpenCreate,
}) => {
  return (
    <>
      {/* Encabezado del Dashboard */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            Panel de Gestión de Usuarios
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 1 }}>
            Administra los usuarios, sus proyectos y tareas asignadas
          </Typography>
        </Box>
        <Avatar
          sx={{ bgcolor: "white", color: "primary.main", width: 56, height: 56 }}
        >
          <Person sx={{ fontSize: 32 }} />
        </Avatar>
      </Box>

      {/* Estadísticas y Búsqueda */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#f8f9fa",
        }}
      >
        <Stack direction="row" spacing={2}>
          <Paper sx={{ p: 2, minWidth: 180, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              Total Usuarios
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1 }}>
              {totalUsers}
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, minWidth: 180, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              Activos
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mt: 1 }}
              color="success.main"
            >
              {activeUsers}
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, minWidth: 180, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              Roles
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mt: 1 }}
              color="info.main"
            >
              {rolesCount}
            </Typography>
          </Paper>
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField
            variant="outlined"
            placeholder="Buscar usuarios, proyectos o tareas..."
            value={searchTerm}
            onChange={onSearchChange}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <Box sx={{ color: "action.active", mr: 1 }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </Box>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<Group />}
            onClick={onOpenRoles}
            sx={{
              height: 56,
              bgcolor: "secondary.main",
              "&:hover": { bgcolor: "secondary.dark" },
            }}
          >
            Gestionar Roles
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onOpenCreate}
            sx={{ height: 56 }}
          >
            Crear Usuario
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default DashboardHeader;
