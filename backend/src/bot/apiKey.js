const path = require('path')
const fs = require('fs/promises')

const apiKey = {
    get: async (username) => {
        let apiKey;
        try {
            apiKey = await fs.readFile(path.join(__dirname, `../../users/${username}/apiKey.json`))
            apiKey = JSON.parse(apiKey)
        } catch (er) {
            apiKey = false
        }
    
        return Promise.resolve(apiKey);
    },
    set: async (username, apiKey) => {
        try {
            await fs.writeFile(path.join(__dirname, `../../users/${username}/apiKey.json`), JSON.stringify(apiKey), null, 4)
        } catch(er) {
            console.log(`error when creating apiKey files ${er.message}`)
        }
    },
}

module.exports = apiKey