const Transaksjon = require("../../models/Transaksjon");

const getTransaksjoner = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { type = "all", status } = req.query;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Du må være logget inn for å se transaksjoner",
            });
        }

        let query = {};

        if (type === "sent") {
            query.fraEierId = userId;
        } else if (type === "received") {
            query.tilEierId = userId;
        } else {
            query.$or = [{ fraEierId: userId }, { tilEierId: userId }];
        }

        if (status) {
            query.status = status;
        }

        const transaksjoner = await Transaksjon.find(query)
            .populate("reinsdyrId", "navn serienummer")
            .populate("fraEierId", "navn epost")
            .populate("fraFlokkId", "flokkNavn flokkSerienummer")
            .populate("tilEierId", "navn epost")
            .populate("tilFlokkId", "flokkNavn flokkSerienummer")
            .sort({ oppdatertDato: -1 });

        const formattedTransaksjoner = transaksjoner.map((t) => ({
            id: t._id,
            reinsdyr: {
                id: t.reinsdyrId._id,
                navn: t.reinsdyrId.navn,
                serienummer: t.reinsdyrId.serienummer,
            },
            fraEier: {
                id: t.fraEierId._id,
                navn: t.fraEierId.navn,
                epost: t.fraEierId.epost,
            },
            fraFlokk: {
                id: t.fraFlokkId._id,
                navn: t.fraFlokkId.flokkNavn,
                serienummer: t.fraFlokkId.flokkSerienummer,
            },
            tilEier: {
                id: t.tilEierId._id,
                navn: t.tilEierId.navn,
                epost: t.tilEierId.epost,
            },
            tilFlokk: t.tilFlokkId
                ? {
                      id: t.tilFlokkId._id,
                      navn: t.tilFlokkId.flokkNavn,
                      serienummer: t.tilFlokkId.flokkSerienummer,
                  }
                : null,
            status: t.status,
            meldingFraAvsender: t.meldingFraAvsender,
            meldingFraMottaker: t.meldingFraMottaker,
            opprettetDato: t.opprettetDato,
            oppdatertDato: t.oppdatertDato,
            erAvsender: t.fraEierId._id.toString() === userId,
            erMottaker: t.tilEierId._id.toString() === userId,
            kanSvare: t.status === "Venter" && t.tilEierId._id.toString() === userId,
            kanBekrefte: t.status === "GodkjentAvMottaker" && t.fraEierId._id.toString() === userId,
        }));

        const gruppertTransaksjoner = {
            ventende: formattedTransaksjoner.filter((t) => t.status === "Venter" || t.status === "GodkjentAvMottaker"),
            fullførte: formattedTransaksjoner.filter((t) => t.status === "Fullført"),
            avslåtte: formattedTransaksjoner.filter((t) => t.status === "AvslåttAvMottaker" || t.status === "AvslåttAvAvsender" || t.status === "Avbrutt"),
        };

        return res.status(200).json({
            success: true,
            transaksjoner: formattedTransaksjoner,
            gruppertTransaksjoner,
            totaltAntall: formattedTransaksjoner.length,
        });
    } catch (error) {
        console.error("Feil ved henting av transaksjoner:", error);
        return res.status(500).json({
            success: false,
            message: "En serverfeil oppstod under henting av transaksjoner",
        });
    }
};

module.exports = getTransaksjoner;
