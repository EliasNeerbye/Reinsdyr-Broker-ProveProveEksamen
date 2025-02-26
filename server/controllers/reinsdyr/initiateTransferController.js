const Reinsdyr = require("../../models/Reinsdyr");
const Flokk = require("../../models/Flokk");
const Eier = require("../../models/Eier");
const Transaksjon = require("../../models/Transaksjon");

const initiateTransfer = async (req, res) => {
    try {
        const { reinsdyrId, tilEierEpost, melding } = req.body;

        if (!reinsdyrId || !tilEierEpost) {
            return res.status(400).json({
                success: false,
                message: "Reinsdyr ID og mottakers e-post er påkrevd",
            });
        }

        const reinsdyr = await Reinsdyr.findById(reinsdyrId);
        if (!reinsdyr) {
            return res.status(404).json({
                success: false,
                message: "Reinsdyret ble ikke funnet",
            });
        }

        const fraFlokk = await Flokk.findById(reinsdyr.flokkId);
        if (!fraFlokk) {
            return res.status(404).json({
                success: false,
                message: "Flokken ble ikke funnet",
            });
        }

        if (fraFlokk.eierId.toString() !== req.session.userId) {
            return res.status(403).json({
                success: false,
                message: "Du har ikke tillatelse til å overføre dette reinsdyret",
            });
        }

        const tilEier = await Eier.findOne({ epost: tilEierEpost });
        if (!tilEier) {
            return res.status(404).json({
                success: false,
                message: "Finner ingen bruker med denne e-postadressen",
            });
        }

        if (tilEier._id.toString() === req.session.userId) {
            return res.status(400).json({
                success: false,
                message: "Du kan ikke overføre et reinsdyr til deg selv",
            });
        }

        const eksisterendeTransaksjon = await Transaksjon.findOne({
            reinsdyrId: reinsdyr._id,
            status: { $in: ["Venter", "GodkjentAvMottaker"] },
        });

        if (eksisterendeTransaksjon) {
            return res.status(400).json({
                success: false,
                message: "Det finnes allerede en aktiv overføringsforespørsel for dette reinsdyret",
            });
        }

        const nyTransaksjon = new Transaksjon({
            reinsdyrId: reinsdyr._id,
            fraEierId: req.session.userId,
            fraFlokkId: fraFlokk._id,
            tilEierId: tilEier._id,
            meldingFraAvsender: melding || "",
            status: "Venter",
        });

        await nyTransaksjon.save();

        return res.status(201).json({
            success: true,
            message: `Overføringsforespørsel for ${reinsdyr.navn} ble sendt til ${tilEier.navn}`,
            transaksjon: {
                id: nyTransaksjon._id,
                reinsdyrNavn: reinsdyr.navn,
                reinsdyrSerienummer: reinsdyr.serienummer,
                tilEierNavn: tilEier.navn,
                status: nyTransaksjon.status,
                opprettetDato: nyTransaksjon.opprettetDato,
            },
        });
    } catch (error) {
        console.error("Feil ved initiering av overføring:", error);
        return res.status(500).json({
            success: false,
            message: "En serverfeil oppstod under initiering av overføringen",
        });
    }
};

module.exports = initiateTransfer;
