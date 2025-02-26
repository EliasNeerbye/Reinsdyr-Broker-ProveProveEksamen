const Reinsdyr = require("../../models/Reinsdyr");
const Flokk = require("../../models/Flokk");
const Eier = require("../../models/Eier");

const transferRein = async (req, res) => {
    try {
        const { reinsdyrId, targetFlokkId } = req.body;

        if (!reinsdyrId || !targetFlokkId) {
            return res.status(400).json({
                success: false,
                message: "Mangler nødvendige feltdata for overføring",
            });
        }

        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Du må være logget inn for å overføre et reinsdyr",
            });
        }

        const reinsdyr = await Reinsdyr.findById(reinsdyrId);
        if (!reinsdyr) {
            return res.status(404).json({
                success: false,
                message: "Reinsdyret ble ikke funnet",
            });
        }

        const currentFlokk = await Flokk.findById(reinsdyr.flokkId);
        if (!currentFlokk) {
            return res.status(404).json({
                success: false,
                message: "Gjeldende flokk ble ikke funnet",
            });
        }

        if (currentFlokk.eierId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Du har ikke tillatelse til å overføre dette reinsdyret",
            });
        }

        const targetFlokk = await Flokk.findById(targetFlokkId);
        if (!targetFlokk) {
            return res.status(404).json({
                success: false,
                message: "Målflokken ble ikke funnet",
            });
        }

        if (targetFlokk.eierId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Du har ikke tillatelse til å overføre til denne flokken",
            });
        }

        if (currentFlokk._id.toString() === targetFlokk._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Reinsdyret er allerede i denne flokken",
            });
        }

        await Flokk.findByIdAndUpdate(currentFlokk._id, { $pull: { reinsdyr: reinsdyr._id } });

        await Flokk.findByIdAndUpdate(targetFlokk._id, { $push: { reinsdyr: reinsdyr._id } });

        reinsdyr.flokkId = targetFlokk._id;
        await reinsdyr.save();

        return res.status(200).json({
            success: true,
            message: `Reinsdyret "${reinsdyr.navn}" ble overført fra "${currentFlokk.flokkNavn}" til "${targetFlokk.flokkNavn}"`,
            reinsdyr: {
                id: reinsdyr._id,
                navn: reinsdyr.navn,
                serienummer: reinsdyr.serienummer,
                flokkId: targetFlokk._id,
                flokkNavn: targetFlokk.flokkNavn,
            },
        });
    } catch (error) {
        console.error("Feil ved overføring av reinsdyr:", error);
        return res.status(500).json({
            success: false,
            message: "En serverfeil oppstod under overføring av reinsdyret",
        });
    }
};

module.exports = transferRein;
