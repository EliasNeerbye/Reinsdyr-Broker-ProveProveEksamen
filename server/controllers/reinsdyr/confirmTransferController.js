const Transaksjon = require("../../models/Transaksjon");
const Reinsdyr = require("../../models/Reinsdyr");
const Flokk = require("../../models/Flokk");
const Eier = require("../../models/Eier");

const confirmTransfer = async (req, res) => {
    try {
        const { transaksjonId, godkjent } = req.body;

        if (!transaksjonId || godkjent === undefined) {
            return res.status(400).json({
                success: false,
                message: "Transaksjon ID og godkjenning er påkrevd",
            });
        }

        const transaksjon = await Transaksjon.findById(transaksjonId);
        if (!transaksjon) {
            return res.status(404).json({
                success: false,
                message: "Transaksjonen ble ikke funnet",
            });
        }

        if (transaksjon.fraEierId.toString() !== req.session.userId) {
            return res.status(403).json({
                success: false,
                message: "Du har ikke tillatelse til å bekrefte denne overføringen",
            });
        }

        if (transaksjon.status !== "GodkjentAvMottaker") {
            return res.status(400).json({
                success: false,
                message: `Kan ikke bekrefte en transaksjon med status "${transaksjon.status}"`,
            });
        }

        const reinsdyr = await Reinsdyr.findById(transaksjon.reinsdyrId);
        if (!reinsdyr) {
            return res.status(404).json({
                success: false,
                message: "Reinsdyret ble ikke funnet",
            });
        }

        const fraFlokk = await Flokk.findById(transaksjon.fraFlokkId);
        if (!fraFlokk) {
            return res.status(404).json({
                success: false,
                message: "Avgiverflokken ble ikke funnet",
            });
        }

        const tilFlokk = await Flokk.findById(transaksjon.tilFlokkId);
        if (!tilFlokk) {
            return res.status(404).json({
                success: false,
                message: "Mottakerflokken ble ikke funnet",
            });
        }

        const tilEier = await Eier.findById(transaksjon.tilEierId);

        if (godkjent) {
            transaksjon.status = "Fullført";

            await Flokk.findByIdAndUpdate(fraFlokk._id, {
                $pull: { reinsdyr: reinsdyr._id },
            });

            await Flokk.findByIdAndUpdate(tilFlokk._id, {
                $push: { reinsdyr: reinsdyr._id },
            });

            reinsdyr.flokkId = tilFlokk._id;
            await reinsdyr.save();

            await transaksjon.save();

            return res.status(200).json({
                success: true,
                message: `Du har fullført overføringen av ${reinsdyr.navn} til ${tilEier.navn}`,
                transaksjon: {
                    id: transaksjon._id,
                    status: transaksjon.status,
                    oppdatertDato: transaksjon.oppdatertDato,
                },
            });
        } else {
            transaksjon.status = "AvslåttAvAvsender";
            await transaksjon.save();

            return res.status(200).json({
                success: true,
                message: `Du har avslått overføringen av ${reinsdyr.navn} til ${tilEier.navn}`,
                transaksjon: {
                    id: transaksjon._id,
                    status: transaksjon.status,
                    oppdatertDato: transaksjon.oppdatertDato,
                },
            });
        }
    } catch (error) {
        console.error("Feil ved endelig bekreftelse av overføring:", error);
        return res.status(500).json({
            success: false,
            message: "En serverfeil oppstod under endelig bekreftelse av overføringen",
        });
    }
};

module.exports = confirmTransfer;
