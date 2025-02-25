const { createPageData } = require("../../utils/pageUtils");

const projectInfoPage = async (req, res) => {
    try {
        const pageData = createPageData(req, {
            title: "Prosjekt Informasjon",
            cssLinks: ["/css/home.css", "/css/faq.css", "/css/projectInfo.css"],
            scriptLinks: ["/js/navFunctionality.js"],
        });

        res.render("projectInfo", pageData);
    } catch (error) {
        console.error("Error in projectInfoPage:", error);
        res.status(500).render(
            "error",
            createPageData(req, {
                title: "Error",
                error: "En feil oppstod",
            })
        );
    }
};

module.exports = projectInfoPage;
