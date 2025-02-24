const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const beiteområdeSchema = new Schema({
    primærBeiteområde: {
        type: String,
        enum: ["Sør", "Ume", "Pite", "Lule", "Nord", "Enare", "Skolt", "Akkala", "Kildin", "Ter"],
        required: true,
    },
    fylker: [
        {
            type: String,
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

const Beiteområde = mongoose.model("Beiteområde", beiteområdeSchema);

// Eksempler på data basert på søkeresultatene:

const sørsamiskBeiteområde = new Beiteområde({
    primærBeiteområde: "Sør",
    fylker: ["Nordland", "Trøndelag", "Innlandet"],
});

const lulesamiskBeiteområde = new Beiteområde({
    primærBeiteområde: "Lule",
    fylker: ["Nordland"],
});

const nordsamiskBeiteområde = new Beiteområde({
    primærBeiteområde: "Nord",
    fylker: ["Troms og Finnmark"],
});

const enaresamiskBeiteområde = new Beiteområde({
    primærBeiteområde: "Enare",
    fylker: ["Lappland"], // Merk: Dette er i Finland
});

const skoltesamiskBeiteområde = new Beiteområde({
    primærBeiteområde: "Skolt",
    fylker: ["Troms og Finnmark"], // For Neiden og Pasvik i Sør-Varanger kommune
});

const kildinsamiskBeiteområde = new Beiteområde({
    primærBeiteområde: "Kildin",
    fylker: ["Murmansk"], // Merk: Dette er i Russland
});

module.exports = Beiteområde;
