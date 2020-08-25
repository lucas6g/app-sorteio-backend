const express = require("express");

const UserController = require("../controller/UserController");
const router = express.Router();

//register user
router.post("/signup", UserController.signup);
router.post("/signin", UserController.signin);
router.post("/confirmation", UserController.acountConfirmation);

module.exports = router;
