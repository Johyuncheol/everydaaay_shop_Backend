"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const itemData = require("../json/item");
const askData = require("../json/ask");
const reviewData = require("../json/review");
const router = express_1.default.Router();
const generateDate_WidthoutMilisec = () => {
    const dateWithoutMilliseconds = new Date();
    dateWithoutMilliseconds.setMilliseconds(0);
    return dateWithoutMilliseconds;
};
// 모든 영역의 마지막 수정 시간을 저장하기 위한 객체
const lastModifiedTimestamps = generateDate_WidthoutMilisec();
router.get("/", (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const id = url.searchParams.get("id");
    const findData = itemData.item.find((item) => item.id === id);
    if (findData) {
        res.status(200).json({
            data: findData,
            message: "Success to get detail",
        });
    }
    else {
        res.status(404).json({
            message: "Item not found",
        });
    }
});
router.get("/ask", (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const id = url.searchParams.get("id");
    const page = Number(url.searchParams.get("page"));
    const numOfShow = Number(url.searchParams.get("numOfShow"));
    const keys = Object.keys(askData);
    const data = askData;
    if (keys.includes(id)) {
        console.log(data[id].length);
        if (page === 1) {
            const findData = data[id].slice(0, numOfShow);
            const sendData = {
                data: findData,
                totalNums: data[id].length,
            };
            return res.status(201).json(sendData);
        }
        else {
            const findData = data[id].slice((page - 1) * numOfShow, page * numOfShow);
            const sendData = {
                data: findData,
                totalNums: data[id].length,
            };
            return res.status(202).json(sendData);
        }
    }
    else {
        return res.status(404).json({
            message: "Item not found",
        });
    }
});
router.get("/review", (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const id = url.searchParams.get("id");
    const page = Number(url.searchParams.get("page"));
    const numOfShow = Number(url.searchParams.get("numOfShow"));
    const keys = Object.keys(reviewData);
    console.log(keys.includes(id));
    const data = reviewData;
    if (keys.includes(id)) {
        if (page === 1) {
            const findData = data[id].slice(0, numOfShow);
            const sendData = {
                data: findData,
                totalNums: data[id].length,
            };
            return res.status(201).json(sendData);
        }
        else {
            const findData = data[id].slice((page - 1) * numOfShow, page * numOfShow);
            const sendData = {
                data: findData,
                totalNums: data[id].length,
            };
            return res.status(202).json(sendData);
        }
    }
    else {
        return res.status(404).json({
            message: "Item not found",
        });
    }
});
exports.default = router;
