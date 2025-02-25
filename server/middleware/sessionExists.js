const sessionExists = async (req, res, next) => {
    if (req.session.userId) {
        return res.status(409).json({ message: "User is already logged in!", success: false });
    } else {
        next();
    }
};

const sessionNotExists = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "User is not logged in!", success: false });
    } else {
        next();
    }
};

module.exports = { sessionExists, sessionNotExists };
