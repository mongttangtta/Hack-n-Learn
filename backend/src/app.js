import express from "express";
import dotenv from "dotenv";
dotenv.config();
import routes from "./routes/index.js";
import session from "express-session";
import MonogoStore from "connect-mongo";
import helmet from "helmet";
import { swaggerUi, specs } from "./config/swagger.js";
import expressMongoSanitize from "@exortek/express-mongo-sanitize";
import { errorHandler } from "./middlewares/auth.middleware.js";
import { initPassport } from "./config/passport.js";

const app = express();
const isProduction = process.env.NODE_ENV === "production";

app.use(helmet());
app.use(express.json());
app.use(expressMongoSanitize());


app.set("trust proxy", 1);

app.use(
        session({
                secret: process.env.SESSION_SECRET || "supersecret",
                resave: false,
                saveUninitialized: false,
                store: MonogoStore.create({
                        mongoUrl: process.env.MONGO_URI,
                        collectionName: "sessions",
                        ttl: 60 * 60, // 1 hour
                }),
                cookie: {
                        httpOnly: true,
                        secure: isProduction,
                        sameSite: "lax",// CSRF 방지
                        maxAge : 60 * 60 * 1000 // 1 hour
                },
        })
);

initPassport();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api", routes);

app.use(errorHandler);

export default app;