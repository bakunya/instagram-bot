const apiKey = require("../bot/apiKey")
const cookies = require("../bot/cookies")

module.exports = async (req, res, next) => {
    try {
        const userApiKey = await apiKey.get(req?.body?.username)
        const userCookies = await cookies.get(req?.body?.username)
        
        if(!userCookies && !userApiKey) throw Error('must login first')
        const userId = userCookies.find(itm => itm.name === 'ds_user_id')?.value ?? false

        if(!userId) throw Error('user id not found')
     
        let userCookiesString = ''
        userCookies.forEach(itm => userCookiesString += `${itm.name}:${itm.value};`)

        res.locals.userId = userId
        res.locals.apiKey = userApiKey
        res.locals.cookies = userCookies
        res.locals.cookiesStr = userCookiesString
        next()
    } catch (er) {
        next(er)
    }
}