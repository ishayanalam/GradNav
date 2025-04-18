const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { signUpValidation, loginValidation } = require("../helpers/validation");

router.post("/signup", signUpValidation, userController.signup);
router.post("/login", loginValidation, userController.login);

module.exports = router;
