import express from 'express';
import { conectar } from '../config/db.js';

const router = express.Router();

// Creamos una ruta de prueba con conexion a sql server
router.get('/usuarios', async (req, res) => {
    try {
        const pool = await conectar();
        const resultados = await pool.request().query('SELECT * FROM usuarios');
        res.json(resultados.recordset);
    } catch (error) {
        console.error('Error en la consulta a usuarios: ', error);
        res.status(500).send('Error en el servidor');
    }
});


router.get('/', (req, res) => { //req es lo que enviamos y res es lo que express responde
    res.send('El servidor express funciona!!!');
});

router.get('/login', (req, res) => {
    res.send('Desde el login');
});

router.get('/dashboard', (req, res) => {
    res.send('Desde dashboard');
});

router.get('/saludo', (req, res) => {
    res.json({mensaje: "hola desde express"});
});

export default router;