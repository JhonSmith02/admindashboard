import sql from 'mssql';

const config = {
    user: 'jhonsmith',
    password: 'Tpdashboard2025*',
    server: 'tpdashboard.database.windows.net',
    database: 'tpdashboard',
    options: {
        encrypt: true,
        trustServerCertificate: false 
    }
};

async function conectar() {
    try {
        const pool = await sql.connect(config);
        console.log('Conectado a Azure SQL Database');
        return pool;
    } catch (err) {
        console.error('Error al conectar con Azure SQL:', err);
        throw err;
    }
}

export { conectar };
