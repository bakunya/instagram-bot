module.exports = async ({page, userTarget}) => {
    try {
        await page.goto(`https://instagram.com/${userTarget}`, { timeout: 30000, waitUntil: 'domcontentloaded' })
        await page.waitForSelector('span[aria-label="Following"]', { timeout: 30000 })
        await page.evaluate(() => {
            document.querySelector('span[aria-label="Following"]').parentElement.parentElement.click()
        })
        await page.waitForSelector('[role=dialog]', { timeout: 30000 })
        await page.evaluate(() => {
            document.querySelector('[role=dialog]').querySelectorAll('button').forEach(itm => {
                if(itm.textContent === 'Unfollow') return itm.click()
            })
        })
        await page.waitForTimeout(1000)

        return Promise.resolve()
    } catch (er) {
        return Promise.reject(er)
    }
}