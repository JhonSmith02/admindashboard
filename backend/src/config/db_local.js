import sql from 'mssql';

const config = {
    user: 'usr_root',
    password: 'usr_root',
    server: 'localhost',
    database: 'admindashboard',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

async function conectar() {
    try {
       const pool = await sql.connect(config);
       console.log('Se pudo conectar a la base de datos SQL SERVER');
       return pool;
    } catch (err) {
        console.log('Error de conexion: ', err);
        throw err;
    }
}

export { conectar }