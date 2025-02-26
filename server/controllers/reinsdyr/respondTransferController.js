const Transaksjon = require("../../models/Transaksjon");
const Flokk = require("../../models/Flokk");
const Reinsdyr = require("../../models/Reinsdyr");

const respondTransfer = async (req, res) => {
try {
    const { transaksjonId, godkjent, tilFlokkId, melding } = req.body;

    if (!transaksjonId || godkjent === undefined) {
    return res.status(400).json({
        success: false,
        message: "Transaksjon ID og respons er påkrevd",
    });
    }

    const transaksjon = await Transaksjon.findById(transaksjonId);
    if (!transaksjon) {
    return res.status(404).json({
        success: false,
        message: "Transaksjonen ble ikke funnet",
    });
    }

    if (transaksjon.tilEierId.toString() !== req.session.userId) {
    return res.status(403).json({
        success: false,
        message: "Du har ikke tillatelse til å svare på denne overføringsforespørselen",
    });
    }

    if (transaksjon.status !== "Venter") {
    return res.status(400).json({
        success: false,
        message: `Kan ikke svare på en transaksjon med status "${transaksjon.status}"`,
    });
    }

    if (godkjent) {
    if (!tilFlokkId) {
        return res.status(400).json({
            success: false,
            message: "Du må velge en flokk å overføre reinsdyret til",
        });
    }

    const tilFlokk = await Flokk.findById(tilFlokkId);
    if (!tilFlokk) {
        return res.status(404).json({
            success: false,
            message: "Flokken ble ikke funnet",
        });
    }

    if (tilFlokk.eierId.toString() !== req.session.userId) {
        return res.status(403).json({
            success: false,
            message: "Du kan bare overføre til egne flokker",
        });
    }

    transaksjon.tilFlokkId = tilFlokk._id;
    transaksjon.status = "GodkjentAvMottaker";
    transaksjon.meldingFraMottaker = melding || "";
    
    } else {
        transaksjon.status = "AvslåttAvMottaker";
        transaksjon.meldingFraMottaker = melding || "";
    }

    await transaksjon.save();

    const reinsdyr = await Reinsdyr.findById(transaksjon.reinsdyrId);

    return res.status(200).json({
    success: true,
    message: godkjent 
        ? `Du har godkjent overføringen av ${reinsdyr.navn}. Venter på endelig bekreftelse fra avsender.` 
        : `Du har avslått overføringen av ${reinsdyr.navn}.`,
    transaksjon: {
        id: transaksjon._id,
        status: transaksjon.status,
        oppdatertDato: transaksjon.oppdatertDato,
    },
    });
} catch (error) {
    console.error("Feil ved behandling av overføringsforespørsel:", error);
    return res.status(500).json({
        success: false,
        message: "En serverfeil oppstod under behandling av overføringsforespørselen",
    });
}
};

module.exports = respondTransfer;