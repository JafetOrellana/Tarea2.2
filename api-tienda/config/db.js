import mysql2 from 'mysql2';
import 'dotenv/config';

const connection = mysql2.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((error) => {
    throw new Error('El error de conexion es: ', error);
})

export default connection;