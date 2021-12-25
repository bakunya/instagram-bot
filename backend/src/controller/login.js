const botLogin = require('../bot/login')

module.exports = async (req, res, next) => {
    const username = req.body.username?.trim()
    const password = req.body.password
    let page

    res.on('close', async () => {
        try {
            await page?.close()
        } catch (er) {}
    })
    
    try {
        page = await res?.locals?.browser?.newPage()
        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
        await page.setViewport({ width: 360, height: 700 })
        const client = await page?.target()?.createCDPSession()
        await client.send('Network.clearBrowserCookies')
        await botLogin({page, username, password})
        res.send({msg: "success"})
    } catch(er) {
        console.log(er)
        next(er)
    }
}