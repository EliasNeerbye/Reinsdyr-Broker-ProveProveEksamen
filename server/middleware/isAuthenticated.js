const Eier = require("../models/Eier");
const isAuthenticated = async (req, res, next) => {
    if (req.session.userId) {
        try {
            const user = await Eier.findById(req.session.userId);
            if (!user) return res.redirect("/logout");
            req.isAuthenticated = true;
            next();
        } catch (error) {
            console.error("Internal error:", error);
            return res.redirect("/logout");
        }
    } else {
        req.isAuthenticated = false;
        next();
    }
};
module.exports = isAuthenticated;
