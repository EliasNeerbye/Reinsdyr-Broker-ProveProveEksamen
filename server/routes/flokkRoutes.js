const router = require("express").Router();

const { sessionNotExists } = require("../middleware/sessionExists");
const isAuthenticated = require("../middleware/isAuthenticated");

const registerFlokk = require("../controllers/flokk/registerFlokkController");
const getFlokk = require("../controllers/flokk/getFlokkController");

router.post("/registerFlokk", sessionNotExists, registerFlokk);
router.get("/getFlokk/:id", isAuthenticated, getFlokk);

module.exports = router;