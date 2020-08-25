const express = require("express");

const router = express.Router();
const UserController = require("./controller/UserController");
const requireAuth = require("./middlewares/requireAuth");

//rota de teste do token quando o user tem o token
router.get("/token", requireAuth, (req, res) => {
    return res.status(200).json({ email: req.user.email });
});

module.exports = router;
