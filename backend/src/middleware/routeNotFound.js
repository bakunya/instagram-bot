module.exports = (req, res, next) => {
    res.status(404)
    const error = new Error(`🔍 - Not Found - ${req.originalUrl}`)
    next(error)
}