const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eierSchema = new Schema({
    navn: {
        type: String,
        required: true,
    },
    epost: {
        type: String,
        unique: true,
        required: true,
    },
    passord: {
        type: String,
        required: true,
    },
    telefon: {
        type: String,
        unique: true,
        required: true,
    },
    kontaktspråk: {
        type: String,
        enum: ["Sør", "Ume", "Pite", "Lule", "Nord", "Enare", "Skolt", "Akkala", "Kildin", "Ter"],
        required: true,
    },
    rolle: {
        type: String,
        enum: ["Admin", "User"],
        default: "User",
    },
    flokker: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Flokk",
        },
    ],
});

const Eier = mongoose.model("Eier", eierSchema);
module.exports = Eier;
