const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");

require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
            secure: process.env.PROD_TRUE === "true",
            httpOnly: true,
            // sameSite: "lax",
            maxAge: 1 * 24 * 60 * 60 * 1000,
        },
    })
);

const origin = `${process.env.SSL_STATE}://${process.env.APP_IP}:${process.env.PORT}`;
const methods = ["GET", "POST", "PUT", "DELETE"];
const allowedHeaders = ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"];
const exposedHeaders = ["Set-Cookie", "Content-Range", "X-Content-Range"];
const maxAge = 1000 * 60 * 60 * 24 * 1;
const credentials = true;

app.use(
    cors({
        origin,
        methods,
        allowedHeaders,
        exposedHeaders,
        maxAge,
        credentials,
    })
);

app.use(helmet());

const authRoutes = require("./routes/authRoutes");

app.use("/auth", authRoutes);

app.listen(process.env.PORT);
console.warn(`Server is listening on: ${origin}`);
