const express = require("express");

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

const fs = require("fs");

//rota de intensao de pagamento
app.post("/create-payment-intent", async (req, res) => {
    const { items } = req.body;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "usd",
    });
    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});

router.get("/store", (req, res) => {
    fs.readFile("./src/drawPoints.json", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            return res.status(200).json(JSON.parse(data));
        }
    });
});

module.exports = router;
