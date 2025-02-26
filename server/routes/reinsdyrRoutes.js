const router = require("express").Router();

const { sessionNotExists } = require("../middleware/sessionExists");

const registerRein = require("../controllers/reinsdyr/registerReinController");

router.post("/registerRein", sessionNotExists, registerRein);

module.exports = router;
