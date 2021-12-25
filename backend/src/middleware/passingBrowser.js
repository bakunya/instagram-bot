module.exports = (browser) => (req, res, next) => {
    res.locals.browser = browser
    next()
}