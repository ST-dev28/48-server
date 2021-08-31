// minimalistine logika, kaip paleisti projekta
const mysql = require('mysql2/promise');
const server = require('./lib/server');

const app = {}    //objektas app

app.init = async () => {       // inicijuojame app
    // prisijungti prie duomenu bazes
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'barsukas',
    });

    // paruosti reikiamas direktorijas

    // paruosti reikiamus failus

    // inicijuojame serveri
    server.init(connection);   // kreipiuosi i server objekta ir paleidziu init metoda
}

app.init();

module.exports = app;