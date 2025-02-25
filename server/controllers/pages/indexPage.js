const { createPageData } = require("../../utils/pageUtils");

const Eier = require("../../models/Eier");
const Beiteområde = require("../../models/Beiteområde");

const indexPage = async (req, res) => {
    try {
        const searchOptions = new Set([...Eier.schema.path("kontaktspråk").enumValues]);
        let userData = null;

        if (req.isAuthenticated) {
            const user = await Eier.findById(req.session.userId).populate({
                path: "flokker",
                populate: { 
                    path: "reinsdyr",
                    model: "Reinsdyr"
                }
            });

            if (user) {
                userData = {
                    navn: user.navn,
                    flokker: user.flokker.map(flokk => ({
                        id: flokk._id,
                        navn: flokk.flokkNavn,
                        serienummer: flokk.flokkSerienummer,
                        merkeNavn: flokk.merkeNavn,
                        merkeBildelenke: flokk.merkeBildelenke,
                        reinsdyrCount: flokk.reinsdyr ? flokk.reinsdyr.length : 0,
                        reinsdyr: flokk.reinsdyr ? flokk.reinsdyr.map(rein => ({
                            id: rein._id,
                            navn: rein.navn,
                            serienummer: rein.serienummer,
                            fødselsdato: rein.fødselsdato ? new Date(rein.fødselsdato).toLocaleDateString() : "Ukjent"
                        })) : []
                    }))
                };
            }

            user.flokker.forEach((flokk) => {
                searchOptions.add(flokk.flokkNavn);
                flokk.reinsdyr.forEach((reinsdyr) => {
                    searchOptions.add(reinsdyr.navn);
                });
            });
        }

        const pageData = createPageData(req, {
            title: "Home",
            cssLinks: ["/css/home.css"],
            scriptLinks: ["/js/searchBar.js", "/js/navFunctionality.js", "/js/index.js"],
        });

        pageData.searchOptions = Array.from(searchOptions);
        pageData.userData = userData;

        res.render("index", pageData);
    } catch (error) {
        console.error("Error in indexPage:", error);
        res.status(500).render(
            "error",
            createPageData(req, {
                title: "Error",
                error: "An internal server error occurred",
            })
        );
    }
};

module.exports = indexPage;
