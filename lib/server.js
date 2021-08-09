// serverio logika: kaip ji sukurti ir ka jis moka

const http = require('http');
const _data = require('./data');
// console.log(http);

const server = {}    // objektas server

server.httpServer = http.createServer((req, res) => {     // sukuriam serveri
    const baseURL = `http${req.socket.encrypted ? 's' : ''}://${req.headers.host}`;
    const parsedURL = new URL(req.url, baseURL);
    const parsedPathName = parsedURL.pathname;
    let trimmedPath = parsedPathName.replace(/^\/+|\/+$/g, '');

    req.on('data', (data) => {
        console.log('uzklausa atsiunte duomenu...');
        console.log(data);
    })

    // kiti galimi variantai
    //req.on('close', () => {
    //    console.log('uzklausos uzdarymas...');
    //})

    //req.on('error', () => {
    //    console.log('uzklausos klaida...');
    //})

    //req.on('pause', () => {
    //    console.log('uzklausos pauze...');
    //})

    //req.on('readable', () => {
    //   console.log('uzklausa galima skaityti...');
    //})

    //req.on('resume', () => {
    //    console.log('uzklausos pabaiga...');
    //})

    req.on('end', async (data) => {

        const textFileExtensions = ['css', 'js', 'svg'];
        const urlParts = trimmedPath.split('.');
        const fileExtension = urlParts[urlParts.length - 1];
        const isTextFile = textFileExtensions.includes(fileExtension);

        const MIMES = {
            css: 'text/css',
            js: 'text/javascript',
            svg: 'image/svg+xml',
        }

        if (isTextFile) {
            // graziname kazkuri "tekstini" faila -> textFileExtensions

            const fileContent = await _data.readStaticTextFile(trimmedPath);
            if (fileContent === '') {
                res.writeHead(404, {
                    'Content-Type': MIMES[fileExtension],
                })
            } else {
                res.writeHead(200, {
                    'Content-Type': MIMES[fileExtension],
                })
            }
            return res.end(fileContent);

        } else {
            // PAGES
            if (trimmedPath === '') {
                // HOME PAGE: http://www.example.com
                const html = await _data.readHTML('index');
                if (html === '') {
                    res.writeHead(404, {
                        'Content-Type': 'text/html',
                    })
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'text/html',
                    })
                }
                return res.end(html);  // serveris rodo index.html esancia info
            }

            if (trimmedPath === 'about') {
                // ABOUT PAGE http://www.example.com/about
                const html = await _data.readHTML('about');
                if (html === '') {
                    res.writeHead(404, {
                        'Content-Type': 'text/html',
                    })
                } else {
                    res.writeHead(200, {
                        'Content-Type': 'text/html',
                    })
                }
                return res.end(html);
            }
        }

        res.writeHead(404, {
            'Content-Type': 'text/plain',
        })
        return res.end('Content/file not found.');
    })
});

server.init = () => {     //inicijuojame serveri
    // console.log('paleidziame HTTP serveri... ');    // nesaugus serveris
    // console.log('paleidziame HTTPS serveri... ');   // saugus serveris
    server.httpServer.listen(3000, () => {
        console.log('Tavo serveris yra pasiekiamas http://localhost:3000');
    })
}

module.exports = server;