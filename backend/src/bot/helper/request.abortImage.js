module.exports = (request) => {
    let url = request.url()
    if (
        url.includes('png') ||
        url.includes('jpg') ||
        url.includes('jpeg') ||
        url.includes('gif') ||
        url.includes('webp')
    ) {
        request.abort();
    } else {
        request.continue();
    }
  }