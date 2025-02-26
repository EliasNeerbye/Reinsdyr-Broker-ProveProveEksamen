const { createPageData } = require("../../utils/pageUtils");

const mapPage = async (req, res) => {
    try {
        const pageData = createPageData(req, {
            title: "Kart",
            cssLinks: ["/css/home.css", "/css/map.css"],
        });

        res.render("map", pageData);
    } catch (error) {
        console.error("Error in mapPage:", error);
        res.status(500).render(
            "error",
            createPageData(req, {
                title: "Error",
                error: "En feil oppstod",
            })
        );
    }
};

module.exports = mapPage;
