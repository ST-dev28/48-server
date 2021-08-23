const _data = require('../../data');
const helpers = require('../../helpers');

const handlers = {}

handlers.books = (data, callback) => {
    const acceptableMethods = ['get', 'post', 'put', 'delete'];

    if (acceptableMethods.includes(data.httpMethod)) {   // httpMethod => koks vartotojo ketinimas, ka jis nori daryti
        return handlers._books[data.httpMethod](data, callback);
    }

    return callback(405, { error: 'Nepriimtinas uzklausos metodas' })
}

handlers._books = {}

handlers._books.get = async (data, callback) => {
    // gaunam user info
    const title = data.queryStringObject.get('title');

    if (title === '') {
        return callback(400, {
            error: 'Nenurodytas title parametras',
        })
    }

    const content = await _data.read('books', title);
    if (content === '') {
        return callback(400, {
            error: 'Nurodytas vartotojas nerastas',
        })
    }

    const contentObj = helpers.parseJsonToObject(content);
    //delete contentObj.hashedPassword;

    return callback(200, {
        success: contentObj,
    })
}

handlers._books.post = async (data, callback) => {
    // irasom user info
    const { writer, title, year } = data.payload;

    //const hashedPassword = helpers.hash(password);

    const userObject = {
        writer,
        title,
        year,
        //hashedPassword,
        //registerDate: Date.now(),
    }

    const res = await _data.create('books', title, userObject);

    if (res !== true) {
        return callback(400, {
            error: 'Nepavyko sukurti vartotojo',
        })
    }

    return callback(200, {
        success: 'Vartotojas sukurtas',
    })
}

handlers._books.put = async (data, callback) => {
    // atnaujinam user info
    const { writer, title, year } = data.payload;

    if (!title) {
        return callback(400, {
            error: 'Nenurodytas vartotojo title, kuriam reikia atnaujinti informacija',
        })
    }

    if (!writer && !password) {
        return callback(400, {
            error: 'Nenurodyta nei viena reiksme, kuria norima atnaujinti',
        })
    }

    const content = await _data.read('books', title);
    if (content === '') {
        return callback(400, {
            error: 'Nurodytas vartotojas nerastas',
        })
    }

    const contentObj = helpers.parseJsonToObject(content);

    if (writer) {
        // atnaujiname writer
        contentObj.writer = writer;
    }

    if (year) {
        // atnaujiname password
        //const hashedPassword = helpers.hash(password);
        //contentObj.hashedPassword = hashedPassword;
        contentObj.year = year;
    }

    const res = await _data.update('books', title, contentObj);

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

handlers._books.delete = async (data, callback) => {
    // istrinam user info
    const title = data.queryStringObject.get('title');

    if (title === '') {
        return callback(400, {
            error: 'Nenurodytas title parametras',
        })
    }

    const res = await _data.delete('books', title);
    if (res) {
        return callback(200, {
            success: 'Nurodytas vartotojas istrintas',
        })
    } else {
        return callback(400, {
            error: 'Ivyko klaida bandant istrinti vartotoja',
        })
    }
}

module.exports = handlers;