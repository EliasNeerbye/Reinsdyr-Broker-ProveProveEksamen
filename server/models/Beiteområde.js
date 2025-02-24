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
module.exports = Beiteområde;
