const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transaksjonSchema = new Schema(
    {
        reinsdyrId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reinsdyr",
            required: true,
        },
        fraEierId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Eier",
            required: true,
        },
        fraFlokkId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Flokk",
            required: true,
        },
        tilEierId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Eier",
            required: true,
        },
        tilFlokkId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Flokk",
            default: null,
        },
        status: {
            type: String,
            enum: ["Venter", "GodkjentAvMottaker", "AvslåttAvMottaker", "GodkjentAvAvsender", "AvslåttAvAvsender", "Fullført", "Avbrutt"],
            default: "Venter",
        },
        meldingFraAvsender: {
            type: String,
            default: "",
        },
        meldingFraMottaker: {
            type: String,
            default: "",
        },
        opprettetDato: {
            type: Date,
            default: Date.now,
        },
        oppdatertDato: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: {
            createdAt: "opprettetDato",
            updatedAt: "oppdatertDato",
        },
    }
);

transaksjonSchema.pre("save", function (next) {
    this.oppdatertDato = Date.now();
    next();
});

const Transaksjon = mongoose.model("Transaksjon", transaksjonSchema);
module.exports = Transaksjon;
