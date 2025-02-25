const Eier = require("../../models/Eier");
const Flokk = require("../../models/Flokk");
const Reinsdyr = require("../../models/Reinsdyr");
const Beiteområde = require("../../models/Beiteområde");

const searchFunction = async (req, res) => {
    const params = req.query.q;
    if (!params) {
        return res.status(400).json({ message: "Need query!", success: false });
    }

    try {
        const searchPattern = new RegExp(params, "i");

        const eier = await Eier.find({
            $or: [{ navn: searchPattern }, { epost: searchPattern }, { kontaktspråk: searchPattern }, { telefon: searchPattern }],
        })
            .select("navn epost telefon kontaktspråk flokker")
            .populate("flokker", "flokkNavn");

        const flokk = await Flokk.find({
            $or: [{ flokkNavn: searchPattern }, { flokkSerienummer: searchPattern }, { merkeNavn: searchPattern }],
        })
            .select("flokkNavn flokkSerienummer merkeNavn eierId reinsdyr")
            .populate("eierId", "navn")
            .populate("reinsdyr", "navn serienummer");

        const reinsdyr = await Reinsdyr.find({
            $or: [{ serienummer: searchPattern }, { navn: searchPattern }],
        })
            .select("serienummer navn fødselsdato flokkId")
            .populate("flokkId", "flokkNavn flokkSerienummer");

        const beiteområde = await Beiteområde.find({
            $or: [{ primærBeiteområde: searchPattern }, { fylker: searchPattern }],
        }).select("primærBeiteområde fylker");

        let beiteFlokker = [];
        if (beiteområde.length > 0) {
            const beiteOmrådeIds = beiteområde.map((b) => b._id);
            beiteFlokker = await Flokk.find({
                beiteområde: { $in: beiteOmrådeIds },
            })
                .select("flokkNavn flokkSerienummer merkeNavn beiteområde eierId reinsdyr")
                .populate("eierId", "navn")
                .populate("reinsdyr", "navn serienummer");
        }

        const allFlokker = [...flokk];

        const existingFlokkIds = new Set(flokk.map((f) => f._id.toString()));
        beiteFlokker.forEach((bf) => {
            if (!existingFlokkIds.has(bf._id.toString())) {
                allFlokker.push(bf);
            }
        });

        const tableData = {
            eierResults: eier.map((e) => ({
                id: e._id,
                navn: e.navn,
                epost: e.epost,
                telefon: e.telefon,
                språk: e.kontaktspråk,
                type: "eier",
                flokker: e.flokker
                    ? e.flokker.map((f) => ({
                          id: f._id,
                          navn: f.flokkNavn,
                      }))
                    : [],
            })),

            flokkResults: allFlokker.map((f) => ({
                id: f._id,
                navn: f.flokkNavn,
                serienummer: f.flokkSerienummer,
                merke: f.merkeNavn,
                type: "flokk",
                eier: f.eierId
                    ? {
                          id: f.eierId._id,
                          navn: f.eierId.navn,
                      }
                    : null,
                reinsdyr: f.reinsdyr
                    ? f.reinsdyr.map((r) => ({
                          id: r._id,
                          navn: r.navn,
                          serienummer: r.serienummer,
                      }))
                    : [],
            })),

            reinsdyrResults: reinsdyr.map((r) => ({
                id: r._id,
                navn: r.navn,
                serienummer: r.serienummer,
                fødselsdato: r.fødselsdato ? new Date(r.fødselsdato).toLocaleDateString() : "Ukjent",
                type: "reinsdyr",
                flokk: r.flokkId
                    ? {
                          id: r.flokkId._id,
                          navn: r.flokkId.flokkNavn,
                          serienummer: r.flokkId.flokkSerienummer,
                      }
                    : null,
            })),
        };

        return res.status(200).json({
            message: "Her er resultater:",
            results: tableData,
            totalCount: eier.length + allFlokker.length + reinsdyr.length,
            success: true,
        });
    } catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({
            message: "Serverside error!",
            success: false,
        });
    }
};

module.exports = searchFunction;
