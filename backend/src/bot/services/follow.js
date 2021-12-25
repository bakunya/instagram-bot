module.exports = async ({ page, userTarget }) => {
    try {
        await page.goto(`https://instagram.com/${userTarget}`, { timeout: 30000, waitUntil: 'domcontentloaded' })
        await page.waitForSelector('header', { timeout: 30000 })
        await page.evaluate(() => {
            document.querySelectorAll('main[role=main] header section button').forEach(itm => {
                if(itm.textContent === 'Follow') {
                    itm.click()
                    return;
                }
            })
        })
        await page.waitForTimeout(5000)

        return Promise.resolve()
    } catch (er) {
        return Promise.reject(er)
    }
}