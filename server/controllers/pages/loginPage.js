const { createPageData } = require("../../utils/pageUtils");

const loginPage = async (req, res) => {
    try {
        if (req.isAuthenticated) {
            return res.redirect("/profile");
        }

        const pageData = createPageData(req, {
            title: "Logg inn",
            cssLinks: ["/css/auth.css"],
            scriptLinks: ["/js/login.js"],
        });

        res.render("login", pageData);
    } catch (error) {
        console.error("Error in loginPage:", error);
        res.status(500).render(
            "error",
            createPageData(req, {
                title: "Error",
                error: "En feil oppstod under lasting av innloggingssiden",
            })
        );
    }
};

module.exports = loginPage;
