const follow = require("./follow")

module.exports = async ({ page, usersTarget, username }) => {
    try {
        for (let i = 0; i < usersTarget.length; i++) {
            await follow({ page, userTarget: usersTarget[i] })
            global.event.emit('follows', `success follow ${usersTarget[i]} user`, username)
        }

        return Promise.resolve()
    } catch (er) {
        global.event.emit('follows', `failed follow ${usersTarget[i]} user, cause ${er.message}`, username)
        return Promise.reject(er)
    }
}