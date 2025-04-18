const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  signUpValidation,
  loginValidation,
} = require("../middlewares/validation");

const auth = require("../middlewares/auth");

router.post("/signup", signUpValidation, userController.signup);
router.post("/login", loginValidation, userController.login);

//token er jonno
router.get("/get-user", auth.isAuthorized, userController.getUser);

//counselling page e info load korar jonno
router.get("/counselling-info", auth.isAuthorized, userController.getCounsellingUserInfo);

module.exports = router;
