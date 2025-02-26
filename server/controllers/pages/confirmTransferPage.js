const { createPageData } = require("../../utils/pageUtils");
const Transaksjon = require("../../models/Transaksjon");

const confirmTransferPage = async (req, res) => {
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
            .populate("tilEierId", "navn epost")
            .populate("tilFlokkId", "flokkNavn flokkSerienummer");

        if (!transaksjon) {
            return res.render(
                "error",
                createPageData(req, {
                    title: "Error",
                    error: "Transaksjonen ble ikke funnet",
                })
            );
        }

        if (transaksjon.fraEierId._id.toString() !== req.session.userId) {
            return res.render(
                "error",
                createPageData(req, {
                    title: "Error",
                    error: "Du har ikke tilgang til denne transaksjonen",
                })
            );
        }

        if (transaksjon.status !== "GodkjentAvMottaker") {
            return res.render(
                "error",
                createPageData(req, {
                    title: "Error",
                    error: `Kan ikke bekrefte en transaksjon med status "${transaksjon.status}"`,
                })
            );
        }

        const pageData = createPageData(req, {
            title: "Endelig Bekreftelse av Overføring",
            cssLinks: ["/css/auth.css", "/css/transfer.css"],
            scriptLinks: ["/js/confirmTransfer.js"],
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
            tilEier: {
                navn: transaksjon.tilEierId.navn,
                epost: transaksjon.tilEierId.epost,
            },
            tilFlokk: {
                navn: transaksjon.tilFlokkId.flokkNavn,
                serienummer: transaksjon.tilFlokkId.flokkSerienummer,
            },
            meldingFraAvsender: transaksjon.meldingFraAvsender,
            meldingFraMottaker: transaksjon.meldingFraMottaker,
            opprettetDato: new Date(transaksjon.opprettetDato).toLocaleDateString(),
            oppdatertDato: new Date(transaksjon.oppdatertDato).toLocaleDateString(),
        };

        res.render("confirmTransfer", pageData);
    } catch (error) {
        console.error("Error in confirmTransferPage:", error);
        res.status(500).render(
            "error",
            createPageData(req, {
                title: "Error",
                error: "En feil oppstod under lasting av siden",
            })
        );
    }
};

module.exports = confirmTransferPage;
