const { createPageData } = require("../../utils/pageUtils");
const Flokk = require("../../models/Flokk");

const registerReinPage = async (req, res) => {
    try {
        if (!req.isAuthenticated) {
            return res.redirect("/login");
        }

        const flokker = await Flokk.find({ eierId: req.session.userId }).select("flokkNavn flokkSerienummer");

        if (flokker.length === 0) {
            return res.redirect("/registerFlokk?message=Du må registrere en flokk først");
        }

        const pageData = createPageData(req, {
            title: "Registrer Reinsdyr",
            cssLinks: ["/css/auth.css", "/css/registerRein.css"],
            scriptLinks: ["/js/registerRein.js"],
        });

        pageData.flokker = flokker;

        const { flokkId } = req.query;
        if (flokkId) {
            pageData.flokkId = flokkId;
        } else {
            pageData.flokkId = "";
        }

        res.render("registerRein", pageData);
    } catch (error) {
        console.error("Error in registerReinPage:", error);
        res.status(500).render(
            "error",
            createPageData(req, {
                title: "Error",
                error: "En feil oppstod under lasting av siden",
            })
        );
    }
};

module.exports = registerReinPage;
