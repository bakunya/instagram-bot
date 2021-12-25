const unfollow = require("./unfollow")

module.exports = async ({usersTarget, page, username}) => {
    try {
        for (let i = 0; i < usersTarget.length; i++) {
            await unfollow({userTarget: usersTarget[i], page})
            global.event.emit('unfollows', `success unfollow ${usersTarget[i]} user`, username)
        }

        return Promise.resolve()
    } catch (er) {
        global.event.emit('unfollows', `failed unfollow ${usersTarget[i]} user, cause ${er.message}`, username)
        return Promise.reject(er)
    }
}