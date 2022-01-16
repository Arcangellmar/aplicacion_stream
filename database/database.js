const mysql = require('mysql');

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     port: process.env.DB_PORT,
// });

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456a.",
    database: "db_so",
    port: 3306,
});


connection.connect((error) => {
    if (error){
        console.log("Error al conectar base de datos: " + error);
        return;
    }
    console.log("Base de datos conectada.");
});

module.exports = connection;
