
const isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) return next();

    res.status(401).json("Please login")
}

const isAdmin = function(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.isAdmin === true) return next();
        return res.status(401).json("Must be admin user")
    }

    return res.status(401).json("Please login")
}

module.exports = {
    isLoggedIn,
    isAdmin
}