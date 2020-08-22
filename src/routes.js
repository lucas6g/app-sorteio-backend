const express = require("express");

const router = express.Router();
const UserController = require("./controller/UserController");
const requireAuth = require("./middlewares/requireAuth");

//register user
router.post("/signup", UserController.signup);
router.post("/signin", UserController.signin);

router.get("/token", requireAuth, (req, res) => {
    return res.status(200).json({ email: req.user.email });
});

module.exports = router;
