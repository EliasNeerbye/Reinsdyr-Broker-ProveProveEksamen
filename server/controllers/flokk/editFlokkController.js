const Flokk = require("../../models/Flokk");
const Beiteområde = require("../../models/Beiteområde");
const path = require("path");

const editFlokk = async (req, res) => {
    try {
        const { flokkId, flokkNavn, merkeNavn, beiteomraade } = req.body;
        
        if (!flokkId || (!flokkNavn && !merkeNavn && !beiteomraade && !req.files?.merkeBilde)) {
            return res.status(400).json({
                message: "Flokk ID og minst ett felt for endring må angis",
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
                message: "Du har ikke tilgang til å redigere denne flokken",
                success: false,
            });
        }

        const updateData = {};

        if (flokkNavn) updateData.flokkNavn = flokkNavn;

        if (merkeNavn && merkeNavn !== flokk.merkeNavn) {
            const existingMerkeNavn = await Flokk.findOne({ merkeNavn });
            if (existingMerkeNavn) {
                return res.status(409).json({
                    message: "En flokk med dette merkenavnet eksisterer allerede",
                    success: false,
                });
            }
            updateData.merkeNavn = merkeNavn;
        }

        if (req.files?.merkeBilde) {
            const merkeBilde = req.files.merkeBilde;
            const fileExtension = path.extname(merkeBilde.name);
            const allowedExtensions = [".jpg", ".jpeg", ".png", ".svg", ".webp"];

            if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
                return res.status(400).json({
                    message: "Ugyldig filformat. Tillatte formater: JPG, JPEG, PNG, SVG, WEBP",
                    success: false,
                });
            }

            if (merkeBilde.size > 50 * 1024 * 1024) {
                return res.status(400).json({
                    message: "Bildet er for stort. Maksimal størrelse er 50MB",
                    success: false,
                });
            }

            const fileName = `merke_${Date.now()}${fileExtension}`;
            const uploadDir = path.join(__dirname, "../../public/uploads/merker");
            const uploadPath = path.join(uploadDir, fileName);
            const newMerkeBildelenke = `/uploads/merker/${fileName}`;

            await merkeBilde.mv(uploadPath);
            updateData.merkeBildelenke = newMerkeBildelenke;
        }

        if (beiteomraade && beiteomraade !== flokk.beiteområde.toString()) {
            const newBeiteområde = await Beiteområde.findOne({ primærBeiteområde: beiteomraade });
            if (!newBeiteområde) {
                return res.status(404).json({
                    message: "Nytt beiteområde ikke funnet",
                    success: false,
                });
            }

            const currentBeiteområde = await Beiteområde.findById(flokk.beiteområde);
            if (currentBeiteområde) {
                await Beiteområde.findByIdAndUpdate(flokk.beiteområde, {
                    $pull: { flokker: flokk._id }
                });
            }

            await Beiteområde.findByIdAndUpdate(newBeiteområde._id, {
                $push: { flokker: flokk._id }
            });

            updateData.beiteområde = newBeiteområde._id;
        }

        const updatedFlokk = await Flokk.findByIdAndUpdate(
            flokkId,
            updateData,
            { new: true }
        );

        return res.status(200).json({
            message: "Flokk oppdatert",
            success: true,
            flokk: updatedFlokk,
        });
    } catch (error) {
        console.error("Feil ved oppdatering av flokk:", error);
        return res.status(500).json({
            message: "Serverfeil ved oppdatering av flokk",
            success: false,
        });
    }
};

module.exports = editFlokk;
