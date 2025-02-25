const router = require("express").Router();

const { sessionNotExists } = require("../middleware/sessionExists");

const registerRein = require("../controllers/reinsdyr/registerReinController");
const editRein = require("../controllers/reinsdyr/editReinController");
const deleteRein = require("../controllers/reinsdyr/deleteReinController");

router.post("/registerRein", sessionNotExists, registerRein);
router.put("/editRein", sessionNotExists, editRein);
router.delete("/deleteRein", sessionNotExists, deleteRein);

module.exports = router;
