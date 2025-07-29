import express from 'express';

const router = express.Router();

// Creamos una ruta de prueba
router.get('/', (req, res) => { //req es lo que enviamos y res es lo que express responde
    res.send('El servidor express funciona!!!');
});

router.get('/login', (req, res) => {
    res.send('Desde el login');
});

router.get('/dashboard', (req, res) => {
    res.send('Desde dashboard');
});

export default router;