const express = require("express");

const authRoute = require("./routes/authRoute");
const paymentRoute = require("./routes/paymentRoute");
const app = express();

app.use(express.json());
app.use(authRoute);

app.listen(3333, () => {
    console.log("servidor rodando na port 3333");
});
