const router = require("express").Router();

const { sessionNotExists } = require("../middleware/sessionExists");

const registerRein = require("../controllers/reinsdyr/registerReinController");
const transferRein = require("../controllers/reinsdyr/transferReinController");

const initiateTransfer = require("../controllers/reinsdyr/initiateTransferController");
const respondTransfer = require("../controllers/reinsdyr/respondTransferController");
const confirmTransfer = require("../controllers/reinsdyr/confirmTransferController");
const getTransaksjoner = require("../controllers/reinsdyr/getTransaksjonerController");

router.post("/registerRein", sessionNotExists, registerRein);
router.post("/transferRein", sessionNotExists, transferRein);

router.post("/initiateTransfer", sessionNotExists, initiateTransfer);
router.post("/respondTransfer", sessionNotExists, respondTransfer);
router.post("/confirmTransfer", sessionNotExists, confirmTransfer);
router.get("/transactions", sessionNotExists, getTransaksjoner);

module.exports = router;