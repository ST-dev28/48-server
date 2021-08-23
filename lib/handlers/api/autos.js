const _data = require('../../data');
const helpers = require('../../helpers');

const handlers = {}

handlers.autos = (data, callback) => {
    const acceptableMethods = ['get', 'post', 'put', 'delete'];

    if (acceptableMethods.includes(data.httpMethod)) {   // httpMethod => koks vartotojo ketinimas, ka jis nori daryti
        return handlers._autos[data.httpMethod](data, callback);
    }

    return callback(405, { error: 'Nepriimtinas uzklausos metodas' })
}

handlers._autos = {}

handlers._autos.get = async (data, callback) => {
    // gaunam auto info
    const licencePlate = data.queryStringObject.get('licencePlate');

    if (licencePlate === '') {
        return callback(400, {
            error: 'Nenurodytas licencePlate parametras',
        })
    }

    const content = await _data.read('autos', licencePlate);
    if (content === '') {
        return callback(400, {
            error: 'Nurodytas auto nerastas',
        })
    }

    const contentObj = helpers.parseJsonToObject(content);
    //delete contentObj.hashedVin;

    return callback(200, {
        success: contentObj,
    })
}

handlers._autos.post = async (data, callback) => {
    // irasom auto info
    const { brand, model, color, licencePlate, vin } = data.payload;

    const hashedVin = helpers.hash(vin);

    const userObject = {
        brand,
        model,
        licencePlate,
        color,
        hashedVin,
        //registerDate: Date.now(),
    }

    const res = await _data.create('autos', licencePlate, userObject);

    if (res !== true) {
        return callback(400, {
            error: 'Nepavyko sukurti vartotojo',
        })
    }

    return callback(200, {
        success: 'Vartotojas sukurtas',
    })
}

handlers._autos.put = async (data, callback) => {
    // atnaujinam auto info
    const { brand, model, color, licencePlate, vin } = data.payload;

    if (!licencePlate) {
        return callback(400, {
            error: 'Nenurodytas vartotojo licencePlate, kuriam reikia atnaujinti informacija',
        })
    }

    if (!model && !brand && !color) {
        return callback(400, {
            error: 'Nenurodyta nei viena reiksme, kuria norima atnaujinti',
        })
    }

    const content = await _data.read('autos', licencePlate);
    if (content === '') {
        return callback(400, {
            error: 'Nurodytas auto nerastas',
        })
    }

    const contentObj = helpers.parseJsonToObject(content);

    if (model) {
        // atnaujiname model
        contentObj.model = model;
    }

    if (color) {
        // atnaujiname color
        //const hashedPassword = helpers.hash(password);
        //ontentObj.hashedPassword = hashedPassword;
        contentObj.color = color;
    }
    if (brand) {
        // atnaujiname brand
        contentObj.brand = brand;
    }
    if (vin) {
        // atnaujiname vin
        const hashedVin = helpers.hash(vin);
        contentObj.hashedVin = hashedVin;
    }

    const res = await _data.update('autos', licencePlate, contentObj);

    if (res) {
        return callback(200, {
            success: 'Vartotojo informacija atnaujinta',
        })
    } else {
        return callback(400, {
            error: 'Ivyko klaida bandant atnaujinti vartotojo informacija',
        })
    }
}

handlers._autos.delete = async (data, callback) => {
    // istrinam auto info
    const licencePlate = data.queryStringObject.get('licencePlate');

    if (licencePlate === '') {
        return callback(400, {
            error: 'Nenurodytas licencePlate parametras',
        })
    }

    const res = await _data.delete('autos', licencePlate);
    if (res) {
        return callback(200, {
            success: 'Nurodytas auto istrintas',
        })
    } else {
        return callback(400, {
            error: 'Ivyko klaida bandant istrinti auto',
        })
    }
}

module.exports = handlers;