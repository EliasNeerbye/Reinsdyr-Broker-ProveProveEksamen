const Flokk = require("../../models/Eier");

const getFlokk = async (req, res) => {
    try {
        const flokker = await Flokk.find({ eierId: req.session.userId });
        if (!flokker) {
            return res.status(404).json({ message: "Du har ingen flokker!", success: false });
        }
    } catch (error) {
        console.error("GetFlokk error: ", error);
        return res.status(500).json({ message: "Intern server error!", success: false });
    }
};

module.exports = getFlokk;
