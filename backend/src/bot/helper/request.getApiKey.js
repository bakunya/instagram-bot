const apiKey = require("../apiKey");

module.exports = (username) => async (request) => {
    let url = request.url()
    let isImage = [
        url.includes('png'),
        url.includes('jpg'),
        url.includes('jpeg'),
        url.includes('gif'),
        url.includes('webp'),
    ]
    if (request.resourceType() === 'xhr' && request.headers()['x-ig-app-id']) {
        const sourceApiKey = request.headers()['x-ig-app-id']
        await apiKey.set(username, sourceApiKey)
    } else if(isImage.includes(true)) {
        request.abort();
    }
}