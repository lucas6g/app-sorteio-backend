const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/authRoute");
const app = express();

app.use(cors());
app.use(express.json());
app.use(authRoute);

app.listen(3333, () => {
    console.log("servidor rodando na port 3333");
});
