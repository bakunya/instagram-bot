const botUnfollows = require("../bot/unfollows")

module.exports = async (req, res, next) => {
    const username = req.body.username?.trim()
    const expectedLength = req.body.num
    let page

    res.on('close', async () => {
        try {
            await page?.close()
        } catch (er) {}
    })
    
    try {
        global.event.emit("unfollows", "bot unfollows started! please dont close this tab to keep connection still alive", username)
        page = await res?.locals?.browser?.newPage()
        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
        await page.setViewport({ width: 360, height: 700 })
        await page.setCookie(...res?.locals?.cookies ?? [])
        await botUnfollows({ 
            page, 
            username, 
            expectedLength ,
            userId: res?.locals?.userId, 
            apiKey: res?.locals?.apiKey, 
            cookiesStr: res?.locals?.cookiesStr,
        })

        res.send("success")
    } catch (er) {
        console.log(er)
        next(er)
    }
}