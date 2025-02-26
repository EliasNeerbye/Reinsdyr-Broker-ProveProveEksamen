const { createPageData } = require("../../utils/pageUtils");

const faqPage = async (req, res) => {
    try {
        const pageData = createPageData(req, {
            title: "Ofte stilte spørsmål",
            cssLinks: ["/css/home.css", "/css/faq.css"],
        });

        res.render("faq", pageData);
    } catch (error) {
        console.error("Error in faqPage:", error);
        res.status(500).render(
            "error",
            createPageData(req, {
                title: "Error",
                error: "En feil oppstod",
            })
        );
    }
};

module.exports = faqPage;