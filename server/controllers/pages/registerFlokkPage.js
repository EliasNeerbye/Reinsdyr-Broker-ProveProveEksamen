const { createPageData } = require("../../utils/pageUtils");
const Beiteområde = require("../../models/Beiteområde");

const registerFlokkPage = async (req, res) => {
    try {
        if (!req.isAuthenticated) {
            return res.redirect("/login");
        }

        const beiteområder = await Beiteområde.find({}).select("primærBeiteområde");
        const beiteOptions = beiteområder.map((area) => area.primærBeiteområde);

        const pageData = createPageData(req, {
            title: "Registrer Flokk",
            cssLinks: ["/css/auth.css", "/css/registerFlokk.css"],
            scriptLinks: ["/js/registerFlokk.js"],
        });

        pageData.beiteOptions = beiteOptions;
        pageData.kontaktspråk = req.session.kontaktspråk;

        res.render("registerFlokk", pageData);
    } catch (error) {
        console.error("Error in registerFlokkPage:", error);
        res.status(500).render(
            "error",
            createPageData(req, {
                title: "Error",
                error: "En feil oppstod under lasting av siden",
            })
        );
    }
};

module.exports = registerFlokkPage;
