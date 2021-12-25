const getQueryHashCredentials = require("./getData/queryHashCredentials")
const usersWantToFollow = require("./getData/usersWantToFollow")
const abortImage = require("./helper/request.abortImage")
const follows = require("./services/follows")

module.exports = async ({ page, username, postIdArr, followPerPost, apiKey, cookiesStr }) => {
    try {
        await page.setRequestInterception(true)
        page.on('request', abortImage)

        global.event.emit('follows', `trying to get posts credentials`, username)
        
        const credentials = await getQueryHashCredentials({ page, postIdArr, username })

        global.event.emit("follows", "success get posts credentials", username)

        global.event.emit("follows", "trying to get users want to follow", username)

        const usersTarget = await usersWantToFollow({ 
            credentials, 
            apiKey, 
            cookiesStr, 
            followPerPost, 
            username 
        })

        global.event.emit("follows", `success get ${usersTarget.length} users target`, username)

        await follows({ usersTarget, page, username })

        return Promise.resolve()

    } catch (er) {
        return Promise.reject(er)
    }
}