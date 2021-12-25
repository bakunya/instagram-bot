module.exports = (error, _req, res, next) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500

    if (res.headersSent) {
        res.send(error?.message ?? error)
    } else {
        res.status(statusCode).send(error?.message ?? error)
    }
}