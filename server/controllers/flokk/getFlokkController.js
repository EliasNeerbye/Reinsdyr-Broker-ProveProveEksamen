const Flokk = require("../../models/Flokk");
const Reinsdyr = require("../../models/Reinsdyr");

const getFlokk = async (req, res) => {
    try {
        const { id } = req.params;
        const flokkId = id;

        if (!req.isAuthenticated) {
            return res.status(401).json({
                success: false,
                message: "Du må være logget inn for å se flokkdetaljer",
            });
        }

        const flokk = await Flokk.findById(flokkId).populate("beiteområde", "primærBeiteområde fylker");

        if (!flokk) {
            return res.status(404).json({
                success: false,
                message: "Flokken ble ikke funnet",
            });
        }

        if (flokk.eierId.toString() !== req.session.userId) {
            return res.status(403).json({
                success: false,
                message: "Du har ikke tilgang til denne flokken",
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalReinsdyr = await Reinsdyr.countDocuments({ flokkId: flokkId });
        const reinsdyr = await Reinsdyr.find({ flokkId: flokkId }).sort({ navn: 1 }).skip(skip).limit(limit);

        const formattedFlokk = {
            id: flokk._id,
            navn: flokk.flokkNavn,
            serienummer: flokk.flokkSerienummer,
            merkeNavn: flokk.merkeNavn,
            merkeBilde: flokk.merkeBildelenke,
            beiteområde: flokk.beiteområde
                ? {
                      navn: flokk.beiteområde.primærBeiteområde,
                      fylker: flokk.beiteområde.fylker.join(", "),
                  }
                : { navn: "Ukjent", fylker: "" },
            totalReinsdyr: totalReinsdyr,
        };

        const formattedReinsdyr = reinsdyr.map((rein) => ({
            id: rein._id,
            navn: rein.navn,
            serienummer: rein.serienummer,
            fødselsdato: rein.fødselsdato ? new Date(rein.fødselsdato).toLocaleDateString() : "Ukjent",
        }));

        return res.status(200).json({
            message: "Fant flokk og reinsdyr",
            success: true,
            flokk: formattedFlokk,
            reinsdyr: formattedReinsdyr,
            pagination: {
                totalItems: totalReinsdyr,
                totalPages: Math.ceil(totalReinsdyr / limit),
                currentPage: page,
                itemsPerPage: limit,
            },
        });
    } catch (error) {
        console.error("Error in getFlokk:", error);
        return res.status(500).json({
            success: false,
            message: "En feil oppstod ved henting av flokkdetaljer",
        });
    }
};

module.exports = getFlokk;
