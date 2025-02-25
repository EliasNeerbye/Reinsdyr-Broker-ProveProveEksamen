const Eier = require("../../models/Eier");
const validator = require("validator");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
    try {
        const { navn, epost, passord, telefon, kontaktspråk } = req.body;

        if (!navn || !epost || !passord || !telefon || !kontaktspråk) {
            return res.status(400).json({
                success: false,
                message: "Alle felt må fylles ut",
            });
        }

        if (!validator.isEmail(epost)) {
            return res.status(400).json({
                success: false,
                message: "Ugyldig e-postadresse",
            });
        }

        const eksisterendeEpost = await Eier.findOne({ epost });
        if (eksisterendeEpost) {
            return res.status(400).json({
                success: false,
                message: "E-postadressen er allerede i bruk",
            });
        }

        let telefonGyldig = false;
        let rensetTelefon = telefon;

        // \D matcher alle ikke-numeriske tegn (fjerner +, mellomrom, bindestreker, etc.)
        const rensetForLagring = telefon.replace(/\D/g, "");

        const gyldigeTelefonLand = ["nb-NO", "sv-SE", "fi-FI", "ru-RU"];

        // Test med originalt format
        for (const land of gyldigeTelefonLand) {
            if (validator.isMobilePhone(telefon, land)) {
                telefonGyldig = true;
                break;
            }
        }

        // Test med format uten mellomrom hvis nødvendig
        if (!telefonGyldig) {
            // \s+ matcher ett eller flere mellomrom/whitespace
            rensetTelefon = telefon.replace(/\s+/g, "");
            for (const land of gyldigeTelefonLand) {
                if (validator.isMobilePhone(rensetTelefon, land)) {
                    telefonGyldig = true;
                    break;
                }
            }
        }

        if (!telefonGyldig) {
            return res.status(400).json({
                success: false,
                message: "Ugyldig telefonnummer. Støtter norske, svenske, finske og russiske numre.",
            });
        }

        const eksisterendeTelefon = await Eier.findOne({ telefon: rensetForLagring });
        if (eksisterendeTelefon) {
            return res.status(400).json({
                success: false,
                message: "Telefonnummeret er allerede i bruk",
            });
        }

        const gyldigeSpråk = ["Sør", "Ume", "Pite", "Lule", "Nord", "Enare", "Skolt", "Akkala", "Kildin", "Ter"];
        if (!gyldigeSpråk.includes(kontaktspråk)) {
            return res.status(400).json({
                success: false,
                message: "Ugyldig kontaktspråk valgt",
            });
        }

        if (passord.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Passordet må være minst 8 tegn langt",
            });
        }

        const saltRounds = Number(process.env.SALT_ROUNDS);
        const hashedPassord = await bcrypt.hash(passord, saltRounds);

        const nyEier = new Eier({
            navn,
            epost,
            passord: hashedPassord,
            telefon: rensetForLagring,
            kontaktspråk,
        });

        await nyEier.save();

        req.session.userId = nyEier._id;
        req.session.navn = nyEier.navn;
        req.session.epost = nyEier.epost;
        req.session.kontaktspråk = nyEier.kontaktspråk;
        req.session.isLoggedIn = true;


        await new Promise((resolve, reject) => {
            req.session.save((err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        res.status(201).json({
            success: true,
            message: "Bruker ble registrert",
            user: {
                id: nyEier._id,
                navn: nyEier.navn,
                epost: nyEier.epost,
                kontaktspråk: nyEier.kontaktspråk,
            },
        });
    } catch (error) {
        console.error("Registreringsfeil:", error);
        res.status(500).json({
            success: false,
            message: "En serverfeil oppstod under registrering",
        });
    }
};

module.exports = register;
