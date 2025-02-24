const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BEITEOMRÅDE_FYLKER_MAPPING = {
    Sør: ["Trøndelag", "Nordland", "Jämtland", "Västernorrland"],
    Ume: ["Västerbotten"],
    Pite: ["Norrbotten"],
    Lule: ["Nordland", "Norrbotten"],
    Nord: ["Finnmark", "Troms", "Nordland", "Norrbotten", "Lappi"],
    Enare: ["Lappi"],
    Skolt: ["Lappi", "Murmansk oblast"],
    Akkala: ["Murmansk oblast"],
    Kildin: ["Murmansk oblast"],
    Ter: ["Murmansk oblast"],
};

const beiteområdeSchema = new Schema({
    primærBeiteområde: {
        type: String,
        enum: Object.keys(BEITEOMRÅDE_FYLKER_MAPPING),
        required: true,
    },
    fylker: [
        {
            type: String,
            enum: [
                "Nordland",
                "Troms",
                "Finnmark",
                "Trøndelag",
                "Norrbotten",
                "Västerbotten",
                "Jämtland",
                "Västernorrland",
                "Lappi",
                "Murmansk oblast",
                "Republikken Karelen",
            ],
            required: true,
        },
    ],
    flokker: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Flokk",
        },
    ],
});

beiteområdeSchema.pre("save", function (next) {
    if (this.isModified("primærBeiteområde") || this.isNew) {
        this.fylker = BEITEOMRÅDE_FYLKER_MAPPING[this.primærBeiteområde] || [];
    }
    next();
});

const Beiteområde = mongoose.model("Beiteområde", beiteområdeSchema);

module.exports = Beiteområde;
