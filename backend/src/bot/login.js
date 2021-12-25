const abortImage = require('./helper/request.abortImage');
const getApiKey = require('./helper/request.getApiKey');
const cookies = require('./cookies')

const login = async ({ page, username, password }) => {
    try {
        await page.goto('https://instagram.com', { timeout: 30000, waitUntil: 'domcontentloaded' });
        await page.setRequestInterception(true);
        page.on('request', abortImage)
        await page.waitForSelector("#loginForm", { timeout: 30000 })
        await page.type('input[name="username"]', username)
        await page.type('input[name="password"]', password)
        await page.click('button[type="submit"]')
        await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 })
        const sourceCookies = await page.cookies()
        await cookies.set(username, sourceCookies)
        await page.setRequestInterception(true);        
        page.on('request', getApiKey(username));

        return Promise.resolve()
    } catch (er) {
        return Promise.reject(er)
    }
}

module.exports = login