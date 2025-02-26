const router = require("express").Router();

const { sessionNotExists } = require("../middleware/sessionExists");

const registerRein = require("../controllers/reinsdyr/registerReinController");
const transferRein = require("../controllers/reinsdyr/transferReinController");

router.post("/registerRein", sessionNotExists, registerRein);
router.post("/transferRein", sessionNotExists, transferRein);

module.exports = router;