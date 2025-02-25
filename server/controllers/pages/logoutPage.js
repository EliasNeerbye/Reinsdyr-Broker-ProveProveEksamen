const { createPageData } = require("../../utils/pageUtils");

const logoutPage = async (req, res) => {
    try {
        if (!req.isAuthenticated) {
            return res.redirect("/");
        }

        const pageData = createPageData(req, {
            title: "Logg ut",
            cssLinks: ["/css/auth.css", "/css/logout.css"],
            scriptLinks: ["/js/logout.js"],
        });

        res.render("logout", pageData);
    } catch (error) {
        console.error("Error in logoutPage:", error);
        res.status(500).render(
            "error",
            createPageData(req, {
                title: "Error",
                error: "En feil oppstod",
            })
        );
    }
};

module.exports = logoutPage;
