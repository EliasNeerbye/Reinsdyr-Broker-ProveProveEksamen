const Reinsdyr = require("../../models/Reinsdyr");
const Flokk = require("../../models/Flokk");
const uuid = require("uuid");

const registerRein = async (req, res) => {
    try {
        const { navn, flokkId, fødselsdato, customSerienummer } = req.body;

        if (!navn || !flokkId || !fødselsdato) {
            return res.status(400).json({
                message: "Alle obligatoriske felt må fylles ut!",
                success: false,
            });
        }

        const userId = req.session.userId;
        if (!userId) {
            return res.status(403).json({
                message: "Du må være logget inn for å registrere et reinsdyr!",
                success: false,
            });
        }

        const flokk = await Flokk.findById(flokkId);
        if (!flokk) {
            return res.status(404).json({
                message: "Flokken finnes ikke",
                success: false,
            });
        }

        if (flokk.eierId.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "Du har ikke tilgang til å registrere reinsdyr i denne flokken",
                success: false,
            });
        }

        const serienummer = customSerienummer || `R-${uuid.v4().substring(0, 8)}`;

        const existingSerienummer = await Reinsdyr.findOne({ serienummer });
        if (existingSerienummer) {
            return res.status(409).json({
                message: "Et reinsdyr med dette serienummeret eksisterer allerede",
                success: false,
            });
        }

        const birthDate = new Date(fødselsdato);
        const currentDate = new Date();

        if (birthDate > currentDate) {
            return res.status(400).json({
                message: "Fødselsdatoen kan ikke være i fremtiden",
                success: false,
            });
        }

        const nyReinsdyr = new Reinsdyr({
            serienummer,
            navn,
            flokkId,
            fødselsdato: birthDate,
        });

        const savedReinsdyr = await nyReinsdyr.save();

        flokk.reinsdyr.push(savedReinsdyr._id);
        await flokk.save();

        return res.status(201).json({
            message: "Reinsdyr registrert",
            success: true,
            reinsdyr: savedReinsdyr,
        });
    } catch (error) {
        console.error("Feil ved registrering av reinsdyr:", error);
        return res.status(500).json({
            message: "Serverfeil ved registrering av reinsdyr",
            success: false,
        });
    }
};

module.exports = registerRein;
