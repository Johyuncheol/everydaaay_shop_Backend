"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("../dist/routes/auth"));
const detail_1 = __importDefault(require("../dist/routes/detail"));
const main_1 = __importDefault(require("../dist/routes/main"));
const shoppingBag_1 = __importDefault(require("../dist/routes/shoppingBag"));
const category_1 = __importDefault(require("../dist/routes/category"));
const search_1 = __importDefault(require("../dist/routes/search"));
require("dotenv").config();
const app = (0, express_1.default)();
const cors = require("cors");
const port = 8080;
app.use(cors({
    origin: [
        "http://localhost:3002",
        "https://everydaaay.com",
        "https://category.everydaaay.com",
        "https://detail.everydaaay.com",
        "https://contents.everydaaay.com",
        "https://buy.everydaaay.com",
        "https://auth.everydaaay.com",
        "http://localhost:3003",
        "http://localhost:3002",
        "http://localhost:3000"
        /* "http://localhost:3004", */
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.listen(port, function () {
    console.log(`App is listening on port ${port} !`);
});
///////////////////////////////////
// 라우터
app.use("/api/auth", auth_1.default);
app.use("/api/detail", detail_1.default);
app.use("/api/main", main_1.default);
app.use("/api/shoppingBag", shoppingBag_1.default);
app.use("/api/category", category_1.default);
app.use("/api/search", search_1.default);
/////////////////////////////////////
