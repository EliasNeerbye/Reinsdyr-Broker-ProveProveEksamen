const { createPageData } = require("../../utils/pageUtils");

const profilePage = async (req, res) => {
    try {
        const pageData = createPageData(req, {
            title: "Profil",
            cssLinks: ["/css/profile.css"],
            scriptLinks: ["/js/profilePagination.js"],
        });

        res.render("profile", pageData);
    } catch (error) {
        console.error("Error in profilePage:", error);
        res.status(500).render(
            "error",
            createPageData(req, {
                title: "Error",
                error: "En feil oppstod",
            })
        );
    }
};

module.exports = profilePage;
