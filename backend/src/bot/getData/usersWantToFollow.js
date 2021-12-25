module.exports = async ({ credentials, apiKey, cookiesStr, followPerPost, username }) => {
    try {
        let dataToFollow = []

        for (let i = 0; i < credentials.length; i++) {
            const response = await page.evaluate(async (credentials, apiKey, cookiesStr, followPerPost, username) => {
                let data = []
                let next = ""
                let hasNextPage = true

                while (hasNextPage) {
                    let res = await fetch(`https://www.instagram.com/graphql/query/?query_hash=${credentials.hash}&variables={"shortcode":"${credentials.shortcode}","include_reel":true,"first":${followPerPost},"after":"${next}"}`, {
                        method: "GET",
                        credentials: 'include',
                        headers: {
                            "X-IG-App-ID": apiKey,
                            "Cookie": cookiesStr
                        }
                    })
                    res = await res.json()
                    next = res?.data?.shortcode_media?.edge_liked_by?.page_info?.end_cursor ?? false
                    hasNextPage = res?.data?.shortcode_media?.edge_liked_by?.page_info?.has_next_page ?? null
                    let dataUsers = res?.data?.shortcode_media?.edge_liked_by?.edges ?? []

                    for (let i = 0; i < dataUsers.length; i++) {
                        if(
                            !dataUsers[i]?.node?.followed_by_viewer && 
                            !dataUsers[i]?.node?.requested_by_viewer && 
                            dataUsers[i]?.node?.username !== username
                        ) {
                            data.push(dataUsers[i]?.node?.username)
                        }

                        if(data?.length >= followPerPost) break;
                    }

                    if(data?.length >= followPerPost || !hasNextPage) break;
                }

                return data ?? []

            }, credentials[i], apiKey, cookiesStr, followPerPost, username)

            dataToFollow.push(...response)

            global.event.emit('follows', `success get data users from ${credentials[i].shortcode} post`, username)
        }

        return Promise.resolve(dataToFollow)
    } catch (er) {
        return Promise.reject(er)
    }
}