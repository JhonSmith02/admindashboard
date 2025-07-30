import sql from 'mssql';

const config = {
    user: 'root',
    password: 'root',
    server: 'localhost',
    database: 'admindashboard',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        instanceName: 'SQLEXPRESS',
        port: 1433
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