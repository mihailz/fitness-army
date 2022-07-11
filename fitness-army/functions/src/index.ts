const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const serviceAccount = require("./permissions");

app.use(cors({origin: true}));
app.use(bodyParser.urlencoded({
  extended: false,
}));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fitness-army-default-rtdb.europe-west1.firebasedatabase.app",
});

const userRoutes = require("./route/user-route");

app.use(userRoutes);

exports.app = functions.https.onRequest(app);
