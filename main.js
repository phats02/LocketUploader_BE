const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const envFile =
    process.env.NODE_ENV === "production"
        ? ".env.production"
        : ".env.development";

dotenv.config({ path: envFile });

const cors = require("cors");
const { logInfo } = require("./src/services/logger.service.js");

// Routers
const routes = require("./src/routes");
const errorHandler = require("./src/helpers/error-handler.js");

console.log("📚 FRONTEND_URL: ", process.env.FRONTEND_URL)

const app = express();
app.use(morgan('tiny'))
app.use(
    cors({
        origin: [/^http:\/\/localhost:\d+$/, /^http:\/\/127.0.0.1:\d+$/, process.env.FRONTEND_URL],
        methods: ["GET", "POST"],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Nạp các route vào ứng dụng
routes(app);

// Middleware xử lý lỗi
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    logInfo("main.js", `Server backend is running at localhost:${PORT}`);
});
