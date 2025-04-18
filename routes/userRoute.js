const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { signUpValidation } = require("../helpers/validation");

router.post("/signup", signUpValidation, userController.signup);

module.exports = router;
