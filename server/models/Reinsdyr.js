const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reinsdyrSchema = new Schema({
    serienummer: {
        type: String,
        required: true,
        unique: true,
    },
    navn: {
        type: String,
        required: true,
    },
    flokkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flokk",
        required: true,
    },
    fødselsdato: {
        type: Date,
        required: true,
    },
});

const Reinsdyr = mongoose.model("Reinsdyr", reinsdyrSchema);
module.exports = Reinsdyr;
