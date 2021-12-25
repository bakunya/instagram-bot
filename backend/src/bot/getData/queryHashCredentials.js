module.exports = async ({ page, postIdArr, username }) => {
    let credentials = []   

    const getHash = async (response) => {
        if(response.url().includes("/graphql/query")) {
            try {
                const data = await response.json()
                if(data?.data?.shortcode_media?.edge_liked_by?.edges[0]?.node?.username) {
                    let url = new URL(response.url())
                    url = new URLSearchParams(url.search)
                    credentials.push({
                        hash: url.get('query_hash'),
                        shortcode: data?.data?.shortcode_media?.shortcode
                    })
                }
            } catch (er) {console.log(er)}
        }
    }

    try {
        page.on('response', getHash)
        
        for (let i = 0; i < postIdArr.length; i++) {
            await page.goto(`https://instagram.com/p/${postIdArr[i]}`, { timeout: 30000, waitUntil: 'domcontentloaded' })
            await page.waitForSelector(`a[href="/p/${postIdArr[i]}/liked_by/"]`, { timeout: 30000 })
            await page.click(`a[href="/p/${postIdArr[i]}/liked_by/"]`)
            await page.waitForTimeout(1000)
            global.event.emit("follows", `success get ${postIdArr[i]} credentials`, username)

            if(i >= (postIdArr.length - 1)) page.off('response', getHash)
        }

        return Promise.resolve(credentials)
    } catch (er) {
        return Promise.reject(er)
    }
}