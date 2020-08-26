const express = require("express");

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

module.exports = router;
