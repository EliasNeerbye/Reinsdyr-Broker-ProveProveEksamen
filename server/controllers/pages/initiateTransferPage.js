const { createPageData } = require("../../utils/pageUtils");
const Reinsdyr = require("../../models/Reinsdyr");
const Flokk = require("../../models/Flokk");

const initiateTransferPage = async (req, res) => {
    try {
        if (!req.isAuthenticated) {
            return res.redirect("/login");
        }

        const { id } = req.query;
        if (!id) {
            return res.redirect("/profile");
        }

        const reinsdyr = await Reinsdyr.findById(id).populate({
            path: "flokkId",
            select: "flokkNavn flokkSerienummer eierId",
        });

        if (!reinsdyr) {
            return res.render(
                "error",
                createPageData(req, {
                    title: "Error",
                    error: "Reinsdyret ble ikke funnet",
                })
            );
        }

        if (reinsdyr.flokkId.eierId.toString() !== req.session.userId) {
            return res.render(
                "error",
                createPageData(req, {
                    title: "Error",
                    error: "Du har ikke tilgang til dette reinsdyret",
                })
            );
        }

        const pageData = createPageData(req, {
            title: "Overfør Reinsdyr til Annen Eier",
            cssLinks: ["/css/auth.css", "/css/transfer.css"],
            scriptLinks: ["/js/initiateTransfer.js"],
        });

        pageData.reinsdyr = {
            id: reinsdyr._id,
            navn: reinsdyr.navn,
            serienummer: reinsdyr.serienummer,
            fødselsdato: reinsdyr.fødselsdato ? new Date(reinsdyr.fødselsdato).toLocaleDateString() : "Ukjent",
            flokkNavn: reinsdyr.flokkId.flokkNavn,
            flokkSerienummer: reinsdyr.flokkId.flokkSerienummer,
        };

        res.render("initiateTransfer", pageData);
    } catch (error) {
        console.error("Error in initiateTransferPage:", error);
        res.status(500).render(
            "error",
            createPageData(req, {
                title: "Error",
                error: "En feil oppstod under lasting av overføringssiden",
            })
        );
    }
};

module.exports = initiateTransferPage;
