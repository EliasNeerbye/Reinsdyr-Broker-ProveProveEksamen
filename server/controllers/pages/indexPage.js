const { createPageData } = require("../../utils/pageUtils");

const indexPage = (req, res) => {
    try {
        const pageData = createPageData(req, {
            title: "Home",
            cssLinks: ["/css/home.css"],
            scriptLinks: ["/js/searchBar.js"],
        });

        res.render("index", pageData);
    } catch (error) {
        console.error("Error in indexPage:", error);
        res.status(500).render(
            "error",
            createPageData(req, {
                title: "Error",
                error: "An internal server error occurred",
            })
        );
    }
};

module.exports = indexPage;
