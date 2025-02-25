const router = require("express").Router();

const isAuthenticated = require("../middleware/isAuthenticated");

// Base
const indexPage = require("../controllers/pages/indexPage");
const faqPage = require("../controllers/pages/faqPage");
const mapPage = require("../controllers/pages/mapPage");
const searchFunction = require("../controllers/pages/searchFunction");

// Auth
const registerPage = require("../controllers/pages/registerPage");
const loginPage = require("../controllers/pages/loginPage");

// Reinsdyr
const registerReinPage = require("../controllers/pages/registerReinPage");

// Flokk
const registerFlokkPage = require("../controllers/pages/registerFlokkPage");

router.use(isAuthenticated);

router.get("/", indexPage);
router.get("/faq", faqPage);
router.get("/map", mapPage);
router.get("/search", searchFunction);

router.get("/register", registerPage);
router.get("/login", loginPage);

router.get("/registerRein", registerReinPage);

router.get("/registerFlokk", registerFlokkPage);

module.exports = router;
