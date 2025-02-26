const router = require("express").Router();

const isAuthenticated = require("../middleware/isAuthenticated");

// Base
const indexPage = require("../controllers/pages/indexPage");
const faqPage = require("../controllers/pages/faqPage");
const mapPage = require("../controllers/pages/mapPage");
const projectInfoPage = require("../controllers/pages/projectInfoPage");
const profilePage = require("../controllers/pages/profilePage");
const searchFunction = require("../controllers/pages/searchFunction");

// Auth
const registerPage = require("../controllers/pages/registerPage");
const loginPage = require("../controllers/pages/loginPage");
const logoutPage = require("../controllers/pages/logoutPage");

// Reinsdyr
const registerReinPage = require("../controllers/pages/registerReinPage");
const transferReinPage = require("../controllers/pages/transferReinPage");
const initiateTransferPage = require("../controllers/pages/initiateTransferPage");
const transaksjonsPage = require("../controllers/pages/transaksjonsPage");
const respondTransferPage = require("../controllers/pages/respondTransferPage");
const confirmTransferPage = require("../controllers/pages/confirmTransferPage");

// Flokk
const registerFlokkPage = require("../controllers/pages/registerFlokkPage");

router.use(isAuthenticated);

router.get("/", indexPage);
router.get("/faq", faqPage);
router.get("/map", mapPage);
router.get("/projectInfo", projectInfoPage);
router.get("/profile", profilePage);
router.get("/search", searchFunction);

router.get("/register", registerPage);
router.get("/login", loginPage);
router.get("/logout", logoutPage);

router.get("/registerRein", registerReinPage);
router.get("/transferRein", transferReinPage);
router.get("/initiateTransfer", initiateTransferPage);
router.get("/transaksjoner", transaksjonsPage);
router.get("/respondTransfer", respondTransferPage);
router.get("/confirmTransfer", confirmTransferPage);

router.get("/registerFlokk", registerFlokkPage);

module.exports = router;