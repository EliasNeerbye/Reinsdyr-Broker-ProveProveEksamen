const sessionExists = async (req, res, next) => {
    if (req.session.userId) {
        return res.status(409).json({ message: "User is already logged in!", success: false });
    } else {
        console.log(req.session);
        next();
    }
};

module.exports = sessionExists;
