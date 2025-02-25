const router = require("express").Router();

const { sessionNotExists } = require("../middleware/sessionExists");

const registerFlokk = require("../controllers/flokk/registerFlokkController");
const editFlokk = require("../controllers/flokk/editFlokkController");
const deleteFlokk = require("../controllers/flokk/deleteFlokkController");

router.post("/registerFlokk", sessionNotExists, registerFlokk);
router.put("/editFlokk", sessionNotExists, editFlokk);
router.delete("/deleteFlokk", sessionNotExists, deleteFlokk);

module.exports = router;
