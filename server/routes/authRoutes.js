const router = require("express").Router();

const { sessionExists } = require("../middleware/sessionExists");

const register = require("../controllers/auth/registerController");
const login = require("../controllers/auth/loginController");
const logout = require("../controllers/auth/logoutController");

router.post("/register", sessionExists, register);
router.post("/login", sessionExists, login);
router.post("/logout", logout);

module.exports = router;
