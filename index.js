// minimalistine logika, kaip paleisti projekta
const server = require('./lib/server');

const app = {}    //objektas app

app.init = () => {       // inicijuojame app

    // paruosti reikiamas direktorijas

    // paruosti reikiamus failus

    // inicijuojame serveri
    server.init();   // kreipiuosi i server objekta ir paleidziu init metoda
}

app.init();

module.exports = app;