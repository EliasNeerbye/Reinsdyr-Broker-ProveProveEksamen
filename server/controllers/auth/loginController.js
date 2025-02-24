const Eier = require("../../models/Eier");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
    try {
        const { epost, passord } = req.body;

        if (!epost || !passord) {
            return res.status(400).json({
                success: false,
                message: "E-post og passord må fylles ut",
            });
        }

        const eier = await Eier.findOne({ epost });
        if (!eier) {
            return res.status(401).json({
                success: false,
                message: "Ugyldig e-post eller passord",
            });
        }

        const passordMatch = await bcrypt.compare(passord, eier.passord);
        if (!passordMatch) {
            return res.status(401).json({
                success: false,
                message: "Ugyldig e-post eller passord",
            });
        }

        req.session.userId = eier._id;
        req.session.navn = eier.navn;
        req.session.epost = eier.epost;
        req.session.kontaktspråk = eier.kontaktspråk;
        req.session.isLoggedIn = true;

        await new Promise((resolve, reject) => {
            req.session.save((err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        res.status(200).json({
            success: true,
            message: "Innlogging vellykket",
            user: {
                id: eier._id,
                navn: eier.navn,
                epost: eier.epost,
                kontaktspråk: eier.kontaktspråk,
            },
        });
    } catch (error) {
        console.error("Innloggingsfeil:", error);
        res.status(500).json({
            success: false,
            message: "En serverfeil oppstod under innlogging",
        });
    }
};

module.exports = login;
