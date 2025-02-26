const { createPageData } = require("../../utils/pageUtils");
const Transaksjon = require("../../models/Transaksjon");
const Eier = require("../../models/Eier");
const Flokk = require("../../models/Flokk");

const respondTransferPage = async (req, res) => {
    try {
        if (!req.isAuthenticated) {
            return res.redirect("/login");
        }

        const { id } = req.query;
        if (!id) {
            return res.redirect("/transaksjoner");
        }

        const transaksjon = await Transaksjon.findById(id)
            .populate("reinsdyrId", "navn serienummer fødselsdato")
            .populate("fraEierId", "navn epost")
            .populate("fraFlokkId", "flokkNavn flokkSerienummer")
            .populate("tilEierId", "navn epost");

        if (!transaksjon) {
            return res.render(
                "error",
                createPageData(req, {
                    title: "Error",
                    error: "Transaksjonen ble ikke funnet",
                })
            );
        }

        if (transaksjon.tilEierId._id.toString() !== req.session.userId) {
            return res.render(
                "error",
                createPageData(req, {
                    title: "Error",
                    error: "Du har ikke tilgang til denne transaksjonen",
                })
            );
        }

        if (transaksjon.status !== "Venter") {
            return res.render(
                "error",
                createPageData(req, {
                    title: "Error",
                    error: `Kan ikke svare på en transaksjon med status "${transaksjon.status}"`,
                })
            );
        }

        const flokker = await Flokk.find({ eierId: req.session.userId }).select("flokkNavn flokkSerienummer");

        const pageData = createPageData(req, {
            title: "Svar på Overføringsforespørsel",
            cssLinks: ["/css/auth.css", "/css/transfer.css"],
            scriptLinks: ["/js/respondTransfer.js"],
        });

        pageData.transaksjon = {
            id: transaksjon._id,
            reinsdyr: {
                navn: transaksjon.reinsdyrId.navn,
                serienummer: transaksjon.reinsdyrId.serienummer,
                fødselsdato: transaksjon.reinsdyrId.fødselsdato ? new Date(transaksjon.reinsdyrId.fødselsdato).toLocaleDateString() : "Ukjent",
            },
            fraEier: {
                navn: transaksjon.fraEierId.navn,
                epost: transaksjon.fraEierId.epost,
            },
            fraFlokk: {
                navn: transaksjon.fraFlokkId.flokkNavn,
                serienummer: transaksjon.fraFlokkId.flokkSerienummer,
            },
            melding: transaksjon.meldingFraAvsender,
            opprettetDato: new Date(transaksjon.opprettetDato).toLocaleDateString(),
        };

        pageData.flokker = flokker.map((flokk) => ({
            id: flokk._id.toString(),
            navn: flokk.flokkNavn,
            serienummer: flokk.flokkSerienummer,
        }));

        res.render("respondTransfer", pageData);
    } catch (error) {
        console.error("Error in respondTransferPage:", error);
        res.status(500).render(
            "error",
            createPageData(req, {
                title: "Error",
                error: "En feil oppstod under lasting av siden",
            })
        );
    }
};

module.exports = respondTransferPage;
