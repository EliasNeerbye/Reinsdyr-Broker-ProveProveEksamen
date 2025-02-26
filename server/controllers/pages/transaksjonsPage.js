const { createPageData } = require("../../utils/pageUtils");
const Eier = require("../../models/Eier");
const Flokk = require("../../models/Flokk");

const transaksjonsPage = async (req, res) => {
    try {
        if (!req.isAuthenticated) {
            return res.redirect("/login");
        }

        const eier = await Eier.findById(req.session.userId).populate({
            path: "flokker",
            select: "flokkNavn flokkSerienummer",
        });

        if (!eier) {
            return res.redirect("/logout");
        }

        const pageData = createPageData(req, {
            title: "Mine Transaksjoner",
            cssLinks: ["/css/transaksjoner.css"],
            scriptLinks: ["/js/transaksjoner.js"],
        });

        pageData.flokker = eier.flokker.map((flokk) => ({
            id: flokk._id.toString(),
            navn: flokk.flokkNavn,
            serienummer: flokk.flokkSerienummer,
        }));

        res.render("transaksjoner", pageData);
    } catch (error) {
        console.error("Error in transaksjonsPage:", error);
        res.status(500).render(
            "error",
            createPageData(req, {
                title: "Error",
                error: "En feil oppstod under lasting av transaksjonssiden",
            })
        );
    }
};

module.exports = transaksjonsPage;