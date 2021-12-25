const botFollows = require('../bot/follows')

module.exports = async (req, res, next) => {
    const username = req.body.username?.trim()
    const postIdArr = req.body.post?.map(itm => itm?.trim())?.filter(itm => !!itm)
    const followPerPost = req.body.follow_per_post ?? 0

    res.on('close', async () => {
        try {
            await page?.close()
        } catch (er) {}
    })

    try {
        global.event.emit("follows", "bot unfollows started! please dont close this tab to keep connection still alive", username)
        page = await res?.locals?.browser?.newPage()
        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
        await page.setViewport({ width: 360, height: 700 })
        await page.setCookie(...res?.locals?.cookies ?? [])
        await botFollows({
            page,
            username,
            postIdArr,
            followPerPost,
            apiKey: res?.locals?.apiKey,
            cookiesStr: res?.locals?.cookiesStr, 
        })

    } catch (er) {
        next(er)
    }
}