// extraemos la dependencia de express para poder usarla
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';


dotenv.config();

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';



// esta constante nos permite ejecutar express
const app = express();

//Definimos el puerto
const PORT = process.env.PORT || 4000;

//Habilitamos cors para uso global
app.use(cors());

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.json({ok: true, massage: "Api activada"}));


app.listen(PORT, () => {
    console.log(`Servidor back-end servido en el puerto http://localhost:${PORT}`);
});