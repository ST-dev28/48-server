const _data = require('../../data');
const header = require('../../components/header');
const helpers = require('../../helpers');

async function adminUpdateServicesPageHandler(data) {
    const service = data.queryStringObject.get('urlSlug')
    const serviceString = await _data.read('services', service);
    const serviceObj = helpers.parseJsonToObject(serviceString);
    const headerHTML = header(data.user);
    const footerHTML = await _data.readTemplateHTML('footer');

    let headHTML = await _data.readTemplateHTML('head');
    let updateServiceHTML = await _data.readTemplateHTML('update-service');

    headHTML = headHTML.replace('{{page-css}}', 'add-service');
    updateServiceHTML = updateServiceHTML.replace('{{serviceName}}', serviceObj.serviceName)
        .replace('{{urlSlug}}', serviceObj.urlSlug)
        .replace('{{shortDesc}}', serviceObj.shortDesc)
        .replace('{{fullDesc}}', serviceObj.fullDesc)
        .replace('{{price}}', serviceObj.price)
        .replace('{{isActive}}', serviceObj.isActive ? "checked" : "")

    const HTML = `<!DOCTYPE html>
            <html lang="en">
                ${headHTML}
                <body>
                    ${headerHTML}
                    <main>
                        ${updateServiceHTML}
                    </main>
                    ${footerHTML}
                    <script src="/js/update-service.js" type="module" defer></script>
                </body>
            </html>`;

    return { HTML }
}

module.exports = adminUpdateServicesPageHandler;
