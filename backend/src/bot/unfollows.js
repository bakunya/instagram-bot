const getFollowers = require("./getData/followers")
const getFollowings = require("./getData/followings")
const usersNotFollowback = require("./getData/usersNotFollowback")
const abortImage = require("./helper/request.abortImage")
const unfollows = require("./services/unfollows")

module.exports = async ({ page, username, userId, apiKey, cookiesStr, expectedLength }) => {
    try {
        await page.goto(`https://instagram.com/${username}`, { timeout: 30000, waitUntil: 'domcontentloaded' })
        
        await page.setRequestInterception(true);
        page.on('request', abortImage)
    
        global.event.emit('unfollows', `trying to get all followings`, username)

        const followings = await getFollowings({
            page, 
            userId, 
            apiKey,
            cookiesStr, 
            username
        })

        global.event.emit('unfollows', `success get ${followings?.length ?? 0} followings`, username)

        global.event.emit('unfollows', `trying to get all followers`, username)

        const followers = await getFollowers({
            page, 
            userId, 
            apiKey,
            cookiesStr, 
            username
        })

        global.event.emit('unfollows', `success get ${followers?.length ?? 0} followers`, username)

        global.event.emit('unfollows', `trying to get ${expectedLength} users that not followback`, username)

        const usersTarget = await usersNotFollowback({ followers, followings, expectedLength })

        global.event.emit('unfollows', `success get ${usersTarget?.length ?? 0} users that not follow back`, username)

        await unfollows({usersTarget, page, username}) 

        return Promise.resolve()
    } catch (er) {
        return Promise.reject(er)
    }
}