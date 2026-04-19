const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // tu contraseña si tienes
    database: 'inventario_celulares'
});

connection.connect((err) => {
    if (err) {
        console.error('Error de conexión:', err);
    } else {
        console.log('Conectado a MySQL');
    }
});

module.exports = connection;