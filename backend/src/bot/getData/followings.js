const getFollowings = async ({page, userId, cookiesStr, apiKey, username}) => {
    try {
        let fetchCount = await page.evaluate((username) => {
            return Number(document.querySelector(`a[href='/${username}/following/'] > span`).textContent.split(",").join(""))
        }, username)
        fetchCount = fetchCount > 1000 ? 1000 : fetchCount

        const data = await page.evaluate(async ({userId, apiKey, cookiesStr, fetchCount}) => {
            let next = true
            let nextMaxId = 0
            let allData = []
    
            while (next) {
                try {
                    const rawData = await fetch(`https://i.instagram.com/api/v1/friendships/${userId}/following/?count=${fetchCount}&max_id=${nextMaxId}`, {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "X-IG-App-ID": apiKey,
                            "Cookie": cookiesStr
                        }
                    })
                    const data = await rawData.json()
                    data?.users?.forEach(itm => {
                        allData.push(itm.username)
                    })
                    next = data.big_list
                    nextMaxId = data?.next_max_id ?? 0
    
                    if(!next) break;
                } catch(er) {
                    console.error(`error when get followings ${er.message}`)
                    next = false
                }
            }
    
            return Promise.resolve(allData)
    
        }, {userId, apiKey, cookiesStr, fetchCount})
    
        return Promise.resolve(data)
    } catch (er) {
        return Promise.reject(er)
    }
}

module.exports = getFollowings