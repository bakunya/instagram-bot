const path = require('path')
const fs = require('fs/promises')

const cookies = {
    get: async (username) => {
        let cookies;
        try {
            cookies = await fs.readFile(path.join(path.resolve(), `/users/${username}/cookies.json`))
            cookies = JSON.parse(cookies)
        } catch (er) {
            console.log(er)
            cookies = false
        }
    
        return Promise.resolve(cookies);
    },
    set: async (username, cookies) => {
        await fs.writeFile(path.join(path.resolve(), `/users/${username}/cookies.json`), JSON.stringify(cookies), null, 4)
    },
}

module.exports = cookies