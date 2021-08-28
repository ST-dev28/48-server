//const { url } = require('inspector');
const _data = require('../../data');
const helpers = require('../../helpers');

const handlers = {}

handlers.services = (data, callback) => {
    const acceptableMethods = ['get', 'post', 'put', 'delete'];

    if (acceptableMethods.includes(data.httpMethod)) {
        return handlers._services[data.httpMethod](data, callback);
    }

    return callback(405, { error: 'Nepriimtinas uzklausos metodas' })
}

handlers._services = {}

handlers._services.get = async (data, callback) => {
    // gaunam paslaugos info
    const urlSlug = data.queryStringObject.get('urlSlug');

    if (urlSlug === '') {
        return callback(400, {
            error: 'Nenurodytas URL',
        })
    }

    const content = await _data.read('services', urlSlug);
    if (content === '') {
        return callback(400, {
            error: 'Nurodyta paslauga nerasta',
        })
    }

    const contentObj = helpers.parseJsonToObject(content);

    return callback(200, {
        success: contentObj,
    })
}

handlers._services.post = async (data, callback) => {
    // irasom paslaugos info
    const { serviceName, urlSlug, shortDesc, fullDesc, price, isActive } = data.payload;

    if (serviceName === "") {
        return callback(400, {
            error: 'Paslaugos pavadinimas negali buti tuscias',
        })
    }
    if (urlSlug === "") {
        return callback(400, {
            error: 'Paslaugos pavadinimas negali buti tuscias',
        })
    }

    const serviceObject = {
        serviceName,
        urlSlug,
        shortDesc,
        fullDesc,
        price,
        isActive,
    }

    const res = await _data.create('services', urlSlug, serviceObject); //kokius duomenis siuncia

    if (res !== true) {
        return callback(400, {
            error: 'Nepavyko sukurti paslaugos',
        })
    }

    return callback(200, {
        success: 'Paslauga sukurta',
    })
}

handlers._services.put = async (data, callback) => {
    // atnaujinam paslaugos info
    const { serviceName, urlSlug, shortDesc, fullDesc, price, isActive } = data.payload;

    if (!urlSlug) {
        return callback(400, {
            error: 'Nenurodytas URL, kuriam reikia atnaujinti informacija',
        })
    }

    if (serviceName === "") {
        return callback(400, {
            error: 'Paslaugos pavadinimas negali buti tuscias',
        })
    }

    if (urlSlug === "") {
        return callback(400, {
            error: 'Paslaugos URL negali buti tuscias',
        })
    }

    const serviceObject = {
        serviceName,
        urlSlug,
        shortDesc,
        fullDesc,
        price,
        isActive,
    }
    console.log(serviceObject);
    const res = await _data.update('services', urlSlug, serviceObject); //kokius duomenis siuncia

    if (res !== true) {
        return callback(400, {
            error: 'Nepavyko atnaujinti paslaugos',
        })
    }

    return callback(200, {
        success: 'Paslauga atnaujinta',
    })
}


handlers._services.delete = async (data, callback) => {
    // istrinam paslaugos info
    const urlSlug = data.queryStringObject.get('urlSlug');

    if (urlSlug === '') {
        return callback(400, {
            error: 'Nenurodytas URL',
        })
    }

    const res = await _data.delete('services', urlSlug);
    if (res) {
        return callback(200, {
            success: 'Nurodyta paslauga istrinta',
        })
    } else {
        return callback(400, {
            error: 'Ivyko klaida bandant istrinti paslauga',
        })
    }
}

module.exports = handlers;