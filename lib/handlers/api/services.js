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
    //delete contentObj.hashedPassword;

    return callback(200, {
        success: contentObj,
    })
}

handlers._services.post = async (data, callback) => {
    // irasom paslaugos info
    const { serviceName, urlSlug, shortDesc, fullDesc, price, isActive } = data.payload;

    const serviceObject = {
        serviceName,
        urlSlug,
        shortDesc,
        fullDesc,
        price,
        isActive,
        //registerDate: Date.now(),
    }

    const res = await _data.create('services', urlSlug, serviceObject); //kokius duomenis siuncia

    if (res !== true) {
        return callback(400, {
            error: 'Nepavyko sukurti objekto',
        })
    }

    return callback(200, {
        success: 'Objektas sukurtas',
    })
}

handlers._services.put = async (data, callback) => {
    // atnaujinam user info
    const { serviceName, urlSlug, shortDesc, fullDesc, price } = data.payload;

    if (!urlSlug) {
        return callback(400, {
            error: 'Nenurodytas URL, kuriam reikia atnaujinti informacija',
        })
    }

    if (!serviceName && !shortDesc && !fullDesc && !price) {
        return callback(400, {
            error: 'Nenurodyta nei viena reiksme, kuria norima atnaujinti',
        })
    }

    const content = await _data.read('services', urlSlug);
    if (content === '') {
        return callback(400, {
            error: 'Nurodytas paslauga nerasta',
        })
    }

    const contentObj = helpers.parseJsonToObject(content);

    if (serviceName) {
        // atnaujiname serviceName
        contentObj.serviceName = serviceName;
    }
    if (shortDesc) {
        contentObj.shortDesc = shortDesc;
    }
    if (fullDesc) {
        contentObj.fullDesc = fullDesc;
    }
    if (price) {
        contentObj.price = price;
    }

    const res = await _data.update('services', urlSlug, contentObj);

    if (res) {
        return callback(200, {
            success: 'Paslaugos informacija atnaujinta',
        })
    } else {
        return callback(400, {
            error: 'Ivyko klaida bandant atnaujinti paslaugos informacija',
        })
    }
}

handlers._services.delete = async (data, callback) => {
    // istrinam auto info
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