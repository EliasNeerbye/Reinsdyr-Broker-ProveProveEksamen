const router = require("express").Router();

const { sessionNotExists } = require("../middleware/sessionExists");

const registerFlokk = require("../controllers/flokk/registerFlokkController");

router.post("/registerFlokk", sessionNotExists, registerFlokk);

module.exports = router;
