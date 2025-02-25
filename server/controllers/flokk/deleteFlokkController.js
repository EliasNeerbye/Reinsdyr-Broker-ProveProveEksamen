const Flokk = require("../../models/Flokk");
const Reinsdyr = require("../../models/Reinsdyr");
const Eier = require("../../models/Eier");
const Beiteområde = require("../../models/Beiteområde");
const fs = require("fs");
const path = require("path");

const deleteFlokk = async (req, res) => {
    try {
        const { flokkId } = req.body;

        if (!flokkId) {
            return res.status(400).json({
                message: "Flokk ID må angis",
                success: false,
            });
        }

        const flokk = await Flokk.findById(flokkId);
        if (!flokk) {
            return res.status(404).json({
                message: "Flokk ikke funnet",
                success: false,
            });
        }

        if (flokk.eierId.toString() !== req.session.userId) {
            return res.status(403).json({
                message: "Du har ikke tilgang til å slette denne flokken",
                success: false,
            });
        }

        if (flokk.reinsdyr && flokk.reinsdyr.length > 0) {
            return res.status(400).json({
                message: "Flokken har fortsatt reinsdyr. Fjern alle reinsdyr først.",
                success: false,
            });
        }

        await Eier.findByIdAndUpdate(flokk.eierId, {
            $pull: { flokker: flokk._id }
        });

        await Beiteområde.findByIdAndUpdate(flokk.beiteområde, {
            $pull: { flokker: flokk._id }
        });
        if (flokk.merkeBildelenke && flokk.merkeBildelenke.startsWith("/uploads/")) {
            const filePath = path.join(__dirname, "../../public", flokk.merkeBildelenke);
            
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Flokk.findByIdAndDelete(flokkId);

        return res.status(200).json({
            message: "Flokk slettet",
            success: true,
        });
    } catch (error) {
        console.error("Feil ved sletting av flokk:", error);
        return res.status(500).json({
            message: "Serverfeil ved sletting av flokk",
            success: false,
        });
    }
};

module.exports = deleteFlokk;
