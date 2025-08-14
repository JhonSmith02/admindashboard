import React, { useState } from 'react';
// import Grid from '';
import {
    Grid,
    Box,
    Typography,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
    Link
} from '@mui/material';

import imagen from '../../public/img-login.png';

export default function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
      setError(null);

      try {
        const res = await fetch('http://localhost:4000/api/auth/login', {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({email, password})
        });

        const data = await res.json();

        if(!res.ok){
            setError(data.error || 'Error al iniciar sesion');
            return;
        }

        if(remember) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        setUser(data.user);
      } catch (error) {
            console.error('Error en el login', error);
            setError('Errror de conexion con el servidor');
      }
    };

    return (
        <Grid container sx={{ minHeight: '100vh' }}>
            {/* Esto me pone el formulario a la izquierda */}

            <Grid xs={12} md={6} container alignItems="center" justifyContent="center" sx={{ p: 4 }}>
                <Box sx={{ width: '100%', maxWidth: 360 }}>
                    <Typography variant="h4" gutterBottom>
                        Hola, Bienvenido
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Bienvenido de nuevo a tu gestor de usuarios!!!
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                        <TextField label="Email" type="email" fullWidth required margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
                        <TextField label="Contraseña" type="password" fullWidth required margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={remember}
                                    onChange={e => setRemember(e.target.checked)}
                                />
                            }
                            label="Recordar usuario"
                        />

                        {error && (
                            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                {error}
                            </Typography>
                        )}

                        <Button type="submit" variant='contained' fullWidth sx={{ mt: 3, mb: 1 }}>
                            Inicia Sesion
                        </Button>

                        <Box display="flex" justifyContent="space-between" sx={{ mt: 1 }}>
                            <Link href="#" variant="body2">Olvidaste tu contrasena?</Link>
                        </Box>
                    </Box>
                </Box>
            </Grid>

            <Grid md={6} sx={{display: { xs: 'none', md: 'block'}, background: `url(${imagen}) center/cover no-repeat`, }} />
          
        </Grid>
    );
}


