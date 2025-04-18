const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  signUpValidation,
  loginValidation,
  counselingRequestValidation,
} = require("../middlewares/validation");

const auth = require("../middlewares/auth");

const admin = require("../middlewares/isAdmin.js");

router.post("/signup", signUpValidation, userController.signup);
router.post("/login", loginValidation, userController.login);
//router.get("/admin/counselings", auth.isAuthorized, admin.isAdmin, userController.getAllCounselingRequests);

//token er jonno
router.get("/get-user", auth.isAuthorized, userController.getUser);

//counselling page e info load korar jonno
router.get(
  "/counselling-info",
  auth.isAuthorized,
  userController.getCounsellingUserInfo
);
router.post(
  "/create-counseling",
  counselingRequestValidation,
  userController.createCounselingRequest
);

router.get("/admin/counselings", auth.isAuthorized, admin.isAdmin, userController.getAllCounselingRequests);


module.exports = router;
