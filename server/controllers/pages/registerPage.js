const { createPageData } = require("../../utils/pageUtils");
const Beiteområde = require("../../models/Beiteområde");

const registerPage = async (req, res) => {
    try {
        if (req.isAuthenticated) {
            return res.redirect("/profile");
        }

        const beiteområder = await Beiteområde.find({}).select("primærBeiteområde");
        const språkOptions = beiteområder.map((area) => area.primærBeiteområde);

        const pageData = createPageData(req, {
            title: "Registrer",
            cssLinks: ["/css/auth.css"],
            scriptLinks: ["/js/register.js"],
        });

        pageData.språkOptions = språkOptions;

        res.render("register", pageData);
    } catch (error) {
        console.error("Error in registerPage:", error);
        res.status(500).render(
            "error",
            createPageData(req, {
                title: "Error",
                error: "En feil oppstod under lasting av registreringssiden",
            })
        );
    }
};

module.exports = registerPage;
