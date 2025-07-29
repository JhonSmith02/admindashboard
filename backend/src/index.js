// extraemos la dependencia de express para poder usarla
import express from 'express';
import router from  './routes/index.js';

// esta constante nos permite ejecutar express
const app = express();

//Definimos el puerto
const PORT = process.env.PORT || 4000;

//Agrega router
app.use('/', router)

app.listen(PORT, () => {
    console.log(`Servidor back-end servido en el puerto http://localhost:${PORT}`);
});