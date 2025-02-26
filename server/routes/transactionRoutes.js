const router = require("express").Router();

const { sessionNotExists } = require("../middleware/sessionExists");

const initiateTransfer = require("../controllers/reinsdyr/initiateTransferController");
const respondTransfer = require("../controllers/reinsdyr/respondTransferController");
const confirmTransfer = require("../controllers/reinsdyr/confirmTransferController");
const getTransaksjoner = require("../controllers/reinsdyr/getTransaksjonerController");

router.post("/initiate", sessionNotExists, initiateTransfer);

router.post("/respond", sessionNotExists, respondTransfer);

router.post("/confirm", sessionNotExists, confirmTransfer);

router.get("/", sessionNotExists, getTransaksjoner);

module.exports = router;
