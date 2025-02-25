const Reinsdyr = require("../../models/Reinsdyr");
const Flokk = require("../../models/Flokk");

const deleteRein = async (req, res) => {
    try {
        const { reinsdyrId } = req.body;

        if (!reinsdyrId) {
            return res.status(400).json({
                message: "Reinsdyr ID må angis",
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

        const flokk = await Flokk.findById(reinsdyr.flokkId);
        if (!flokk) {
            return res.status(404).json({
                message: "Flokk ikke funnet",
                success: false,
            });
        }

        if (flokk.eierId.toString() !== req.session.userId) {
            return res.status(403).json({
                message: "Du har ikke tilgang til å slette dette reinsdyret",
                success: false,
            });
        }

        await Flokk.findByIdAndUpdate(reinsdyr.flokkId, {
            $pull: { reinsdyr: reinsdyr._id }
        });

        await Reinsdyr.findByIdAndDelete(reinsdyrId);

        return res.status(200).json({
            message: "Reinsdyr slettet",
            success: true,
        });
    } catch (error) {
        console.error("Feil ved sletting av reinsdyr:", error);
        return res.status(500).json({
            message: "Serverfeil ved sletting av reinsdyr",
            success: false,
        });
    }
};

module.exports = deleteRein;
