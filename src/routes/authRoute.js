const express = require("express");
const crypto = require("crypto");
const UserController = require("../controller/UserController");
const router = express.Router();

//register user
router.post("/signup", UserController.signup);
router.post("/signin", UserController.signin);
router.post("/confirmation", UserController.acountConfirmation);
router.post(
    "/resend_confirmation_token",
    UserController.reSendConfirmationToken
);

module.exports = router;
