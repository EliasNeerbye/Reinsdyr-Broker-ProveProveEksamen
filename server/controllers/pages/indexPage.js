const { createPageData } = require("../../utils/pageUtils");

const Eier = require("../../models/Eier");
const Beiteområde = require("../../models/Beiteområde");

const indexPage = async (req, res) => {
    try {
        const searchOptions = new Set([...Eier.schema.path("kontaktspråk").enumValues]);

        if (req.isAuthenticated) {
            const user = await Eier.findById(req.session.userId).populate({
                path: "flokker",
                populate: { path: "reinsdyr" },
            });

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
            scriptLinks: ["/js/searchBar.js", "/js/navFunctionality.js"],
        });

        pageData.searchOptions = Array.from(searchOptions);

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