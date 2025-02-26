const { createPageData } = require("../../utils/pageUtils");
const Eier = require("../../models/Eier");
const Flokk = require("../../models/Flokk");

const profilePage = async (req, res) => {
    try {
        if (!req.isAuthenticated) {
            return res.redirect("/login");
        }

        const eier = await Eier.findById(req.session.userId).populate({
            path: "flokker",
            select: "flokkNavn flokkSerienummer merkeNavn merkeBildelenke reinsdyr beiteområde",
            populate: {
                path: "beiteområde",
                select: "primærBeiteområde fylker",
            },
        });

        if (!eier) {
            return res.redirect("/logout");
        }

        const pageData = createPageData(req, {
            title: "Profil",
            cssLinks: ["/css/profile.css"],
            scriptLinks: ["/js/profilePagination.js"],
        });

        pageData.eier = {
            navn: eier.navn,
            epost: eier.epost,
            telefon: eier.telefon,
            kontaktspråk: eier.kontaktspråk,
        };

        pageData.flokker = eier.flokker.map((flokk) => ({
            id: flokk._id.toString(),
            navn: flokk.flokkNavn,
            serienummer: flokk.flokkSerienummer,
            merkeNavn: flokk.merkeNavn,
            merkeBilde: flokk.merkeBildelenke,
            reinsdyrCount: flokk.reinsdyr.length,
            beiteområde: flokk.beiteområde
                ? {
                      navn: flokk.beiteområde.primærBeiteområde,
                      fylker: flokk.beiteområde.fylker.join(", "),
                  }
                : { navn: "Ukjent", fylker: "" },
        }));

        res.render("profile", pageData);
    } catch (error) {
        console.error("Error in profilePage:", error);
        res.status(500).render(
            "error",
            createPageData(req, {
                title: "Error",
                error: "En feil oppstod ved lasting av profilsiden",
            })
        );
    }
};

module.exports = profilePage;