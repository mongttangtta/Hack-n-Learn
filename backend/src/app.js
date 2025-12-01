import express from "express";
import dotenv from "dotenv";
dotenv.config();
import routes from "./routes/index.js";
import session from "express-session";
import MonogoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import multer from "multer";
import { swaggerUi, specs } from "./config/swagger.js";
import expressMongoSanitize from "@exortek/express-mongo-sanitize";
import { errorHandler, requireLogin } from "./middlewares/auth.middleware.js";
import passport from "./config/passport.js";
import internalRouter from "./routes/internal.routes.js";

const app = express();
const isProduction = process.env.NODE_ENV === "production";

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    // /api/problems/:slug/submit 경로는 sanitize 건너뛰기
    if (req.path.match(/^\/api\/problems\/[^/]+\/submit$/)) {
        console.log('[SANITIZE] Skipping for flag submission:', req.path);
        return next();
    }
    expressMongoSanitize()(req, res, next);
});


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
                        secure: isProduction,  // isProduction , true
                        sameSite: "lax",// lax
                        maxAge : 60 * 60 * 1000, // 1 hour
                        //domain: "hacknlearn.site", // .localhost.com
                },
        })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api", routes);
app.use("/internal", requireLogin, internalRouter);


app.use((err, req, res, next) => {
        if(err instanceof multer.MulterError) {
                return res.status(400).json({ success: false, message: err.message });
        }

        if (err) {
                return res.status(400).json({
                success: false,
                message: err.message,
                });
        }
        next();
});

app.use(errorHandler);

export default app;