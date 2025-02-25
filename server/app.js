const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const fileupload = require("express-fileupload");

require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileupload({ limits: { fileSize: 50 * 1024 * 1024 }, createParentPath: true }));

const mongoConnectionString =
    process.env.PROD_TRUE === "true"
        ? `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@${process.env.MONGO_IP}/reindeerBroker`
        : `mongodb://${process.env.MONGO_IP}/reindeerBroker`;

mongoose
    .connect(mongoConnectionString)
    .then(() => {
        console.log("Connected to mongodb!");
    })
    .catch((err) => {
        console.error("Connection error!", err);
    });

app.use(
    session({
        secret: process.env.SESSION_SECRET || "default-secret-key",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: mongoConnectionString,
            collectionName: "sessions",
            ttl: 1 * 24 * 60 * 60,
        }),
        cookie: {
            secure: false,
            httpOnly: true,
            // sameSite: "lax",
            maxAge: 1 * 24 * 60 * 60 * 1000,
        },
    })
);

const authRoutes = require("./routes/authRoutes");
const reinsdyrRoutes = require("./routes/reinsdyrRoutes");
const flokkRoutes = require("./routes/flokkRoutes");
const getRoutes = require("./routes/getRoutes");

app.use("/auth", authRoutes);
app.use("/reinsdyr", reinsdyrRoutes);
app.use("/flokk", flokkRoutes);
app.use("/", getRoutes);

app.listen(process.env.PORT);
console.warn(`Server is listening on: ${origin}`);
