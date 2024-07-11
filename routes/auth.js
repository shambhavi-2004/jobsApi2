const express = require("express");
const router = express.Router();
//auth mw for authentiacting route for updating user(so that the user can onlu update his own profile not other user's profile)
const authenticateUser = require("../middleware/authentication");

const { register, login, updateUser } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.patch("/updateUser", authenticateUser, updateUser);

module.exports = router;
