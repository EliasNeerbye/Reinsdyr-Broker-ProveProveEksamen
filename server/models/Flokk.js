const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const flokkSchema = new Schema({
    eierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Eier",
        unique: true,
        required: true,
    },
    flokkNavn: {
        type: String,
        required: true,
    },
    flokkSerienummer: {
        type: String,
        required: true,
        unique: true,
    },
    merkeNavn: {
        type: String,
        unique: true,
        required: true,
    },
    merkeBildelenke: {
        type: String,
        unique: true,
        required: true,
    },
    reinsdyr: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reinsdyr",
        },
    ],
    beiteområde: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Beiteområde",
    },
});

const Flokk = mongoose.model("Flokk", flokkSchema);
module.exports = Flokk;
