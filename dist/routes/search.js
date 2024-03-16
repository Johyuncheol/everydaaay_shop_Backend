"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const searchData = require("../json/search");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const text = url.searchParams.get("text");
    const page = Number(url.searchParams.get("page"));
    const searchResult = searchData.filter((item) => item.name.includes(text));
    console.log(searchResult);
    return res.status(201).send({
        data: searchResult,
        status: "Success to get main",
    });
});
exports.default = router;
