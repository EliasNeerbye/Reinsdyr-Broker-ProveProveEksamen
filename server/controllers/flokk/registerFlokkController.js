const Eier = require("../../models/Eier");
const Flokk = require("../../models/Flokk");
const Beiteområde = require("../../models/Beiteområde");
const path = require("path");
const uuid = require("uuid");

const registerFlokk = async (req, res) => {
    try {
        const { flokkNavn, merkeNavn, beiteområde, flokkSerienummer, merkeBildelenke } = req.body;

        if (!flokkNavn || !merkeNavn) {
            return res.status(400).json({
                message: "Alle obligatoriske felt må fylles ut!",
                success: false,
            });
        }

        const finalFlokkSerienummer = flokkSerienummer || `F-${uuid.v4().substring(0, 8)}`;

        let finalMerkeBildelenke = merkeBildelenke;

        if (!merkeBildelenke) {
            const { merkeBilde } = req.files || {};
            if (!merkeBilde) {
                return res.status(400).json({
                    message: "Du må legge til et Bumerke bilde eller en bildelenke!",
                    success: false,
                });
            }

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
            finalMerkeBildelenke = `/uploads/merker/${fileName}`;

            await merkeBilde.mv(uploadPath);
        }

        const eier = await Eier.findById(req.session.userId);
        if (!eier) {
            return res.status(403).json({
                message: "Du må være logget inn for å registrere en flokk!",
                success: false,
            });
        }

        if (!beiteområde) {
            beiteområde = eier.kontaktspråk;
        }

        const beiteområdeObj = await Beiteområde.findOne({
            primærBeiteområde: beiteområde,
        });

        if (!beiteområdeObj) {
            return res.status(403).json({
                message: "Du må velge et eksisterende beiteområde",
                success: false,
            });
        }

        const existingMerkeNavn = await Flokk.findOne({ merkeNavn });
        if (existingMerkeNavn) {
            return res.status(409).json({
                message: "En flokk med dette merkenavnet eksisterer allerede",
                success: false,
            });
        }

        const existingFlokkSerienummer = await Flokk.findOne({
            flokkSerienummer: finalFlokkSerienummer,
        });

        if (existingFlokkSerienummer) {
            return res.status(409).json({
                message: "En flokk med dette serienummeret eksisterer allerede",
                success: false,
            });
        }

        const nyFlokk = new Flokk({
            eierId: eier._id,
            flokkNavn,
            flokkSerienummer: finalFlokkSerienummer,
            merkeNavn,
            merkeBildelenke: finalMerkeBildelenke,
            beiteområde: beiteområdeObj._id,
            reinsdyr: [],
        });

        const savedFlokk = await nyFlokk.save();

        beiteområdeObj.flokker.push(savedFlokk._id);
        await beiteområdeObj.save();

        eier.flokker.push(savedFlokk._id);
        await eier.save();

        return res.status(201).json({
            message: "Flokk registrert",
            success: true,
            flokk: savedFlokk,
        });
    } catch (error) {
        console.error("Feil ved registrering av flokk:", error);
        return res.status(500).json({
            message: "Serverfeil ved registrering av flokk",
            success: false,
        });
    }
};

module.exports = registerFlokk;
