const Reinsdyr = require("../../models/Reinsdyr");
const Flokk = require("../../models/Flokk");

const editRein = async (req, res) => {
    try {
        const { reinsdyrId, navn, flokkId, fødselsdato, serienummer } = req.body;

        if (!reinsdyrId || (!navn && !flokkId && !fødselsdato && !serienummer)) {
            return res.status(400).json({
                message: "Reinsdyr ID og minst ett felt for endring må angis",
                success: false,
            });
        }

        const reinsdyr = await Reinsdyr.findById(reinsdyrId);
        if (!reinsdyr) {
            return res.status(404).json({
                message: "Reinsdyr ikke funnet",
                success: false,
            });
        }

        const currentFlokk = await Flokk.findById(reinsdyr.flokkId);
        if (!currentFlokk) {
            return res.status(404).json({
                message: "Gjeldende flokk ikke funnet",
                success: false,
            });
        }

        if (currentFlokk.eierId.toString() !== req.session.userId) {
            return res.status(403).json({
                message: "Du har ikke tilgang til å redigere dette reinsdyret",
                success: false,
            });
        }

        const updateData = {};

        if (navn) updateData.navn = navn;
        
        if (fødselsdato) {
            const birthDate = new Date(fødselsdato);
            const currentDate = new Date();
            
            if (birthDate > currentDate) {
                return res.status(400).json({
                    message: "Fødselsdatoen kan ikke være i fremtiden",
                    success: false,
                });
            }
            updateData.fødselsdato = birthDate;
        }

        if (serienummer && serienummer !== reinsdyr.serienummer) {
            const existingSerienummer = await Reinsdyr.findOne({ serienummer });
            if (existingSerienummer) {
                return res.status(409).json({
                    message: "Et reinsdyr med dette serienummeret eksisterer allerede",
                    success: false,
                });
            }
            updateData.serienummer = serienummer;
        }

        if (flokkId && flokkId !== reinsdyr.flokkId.toString()) {
            const newFlokk = await Flokk.findById(flokkId);
            if (!newFlokk) {
                return res.status(404).json({
                    message: "Ny flokk ikke funnet",
                    success: false,
                });
            }

            if (newFlokk.eierId.toString() !== req.session.userId) {
                return res.status(403).json({
                    message: "Du har ikke tilgang til å flytte reinsdyr til denne flokken",
                    success: false,
                });
            }

            await Flokk.findByIdAndUpdate(reinsdyr.flokkId, {
                $pull: { reinsdyr: reinsdyr._id }
            });

            await Flokk.findByIdAndUpdate(flokkId, {
                $push: { reinsdyr: reinsdyr._id }
            });

            updateData.flokkId = flokkId;
        }

        const updatedReinsdyr = await Reinsdyr.findByIdAndUpdate(
            reinsdyrId,
            updateData,
            { new: true }
        );

        return res.status(200).json({
            message: "Reinsdyr oppdatert",
            success: true,
            reinsdyr: updatedReinsdyr,
        });
    } catch (error) {
        console.error("Feil ved oppdatering av reinsdyr:", error);
        return res.status(500).json({
            message: "Serverfeil ved oppdatering av reinsdyr",
            success: false,
        });
    }
};

module.exports = editRein;
