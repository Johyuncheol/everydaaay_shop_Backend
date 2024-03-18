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
let lastModifiedTimestamps = {};
router.get("/", (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const id = url.searchParams.get("id");
    let lastModifiedTimestamp;
    if (id) {
        lastModifiedTimestamps[id] = generateDate_WidthoutMilisec();
        lastModifiedTimestamp = lastModifiedTimestamps[id]; // 수정된 부분
    }
    if (req.get("Cache-Control") === "no-cache" && req.get("If-Modified-Since")) {
        // Last-Modified 헤더 확인
        const ifModifiedSince = req.get("If-Modified-Since");
        // 클라이언트에서 전송한 If-Modified-Since 값이 있고,
        // 해당 값이 해당 영역의 마지막 수정 시간보다 크거나 같으면 304 Not Modified 응답
        if (ifModifiedSince &&
            lastModifiedTimestamp &&
            new Date(ifModifiedSince) >= lastModifiedTimestamp) {
            return res.status(304).send({
                data: null,
                status: `${id} is Not Modified`,
            });
        }
    }
    const findData = itemData.item.find((item) => item.id === id);
    if (findData) {
        // 해당 영역의 응답을 전송하기 전에 마지막 수정 시간 업데이트
        if (lastModifiedTimestamp) {
            res.set("Last-Modified", lastModifiedTimestamp.toUTCString());
        }
        res.status(201).json({
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
    let lastModifiedTimestamp;
    const TimeStampKey = `ask_${id}_${page}`;
    if (id) {
        lastModifiedTimestamps[TimeStampKey] = generateDate_WidthoutMilisec();
        lastModifiedTimestamp = lastModifiedTimestamps[TimeStampKey]; // 수정된 부분
    }
    if (req.get("Cache-Control") === "no-cache" && req.get("If-Modified-Since")) {
        // Last-Modified 헤더 확인
        const ifModifiedSince = req.get("If-Modified-Since");
        // 클라이언트에서 전송한 If-Modified-Since 값이 있고,
        // 해당 값이 해당 영역의 마지막 수정 시간보다 크거나 같으면 304 Not Modified 응답
        if (ifModifiedSince &&
            lastModifiedTimestamp &&
            new Date(ifModifiedSince) >= lastModifiedTimestamp) {
            return res.status(304).send({
                data: null,
                status: `${TimeStampKey} is Not Modified`,
            });
        }
    }
    const keys = Object.keys(askData);
    const data = askData;
    if (keys.includes(id)) {
        if (page === 1) {
            const findData = data[id].slice(0, numOfShow);
            const sendData = {
                data: findData,
                totalNums: data[id].length,
            };
            // 타임스탬프 추가
            if (lastModifiedTimestamp) {
                res.set("Last-Modified", lastModifiedTimestamp.toUTCString());
            }
            return res.status(201).json(sendData);
        }
        else {
            const findData = data[id].slice((page - 1) * numOfShow, page * numOfShow);
            const sendData = {
                data: findData,
                totalNums: data[id].length - 1,
            };
            // 타임스탬프 추가
            if (lastModifiedTimestamp) {
                res.set("Last-Modified", lastModifiedTimestamp.toUTCString());
            }
            return res.status(201).json(sendData);
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
    let lastModifiedTimestamp;
    const TimeStampKey = `review_${id}_${page}`;
    if (id) {
        lastModifiedTimestamps[TimeStampKey] = generateDate_WidthoutMilisec();
        lastModifiedTimestamp = lastModifiedTimestamps[TimeStampKey]; // 수정된 부분
    }
    if (req.get("Cache-Control") === "no-cache" && req.get("If-Modified-Since")) {
        // Last-Modified 헤더 확인
        const ifModifiedSince = req.get("If-Modified-Since");
        // 클라이언트에서 전송한 If-Modified-Since 값이 있고,
        // 해당 값이 해당 영역의 마지막 수정 시간보다 크거나 같으면 304 Not Modified 응답
        if (ifModifiedSince &&
            lastModifiedTimestamp &&
            new Date(ifModifiedSince) >= lastModifiedTimestamp) {
            return res.status(304).send({
                data: null,
                status: `${TimeStampKey} is Not Modified`,
            });
        }
    }
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
            // 타임스탬프 추가
            if (lastModifiedTimestamp) {
                res.set("Last-Modified", lastModifiedTimestamp.toUTCString());
            }
            return res.status(201).json(sendData);
        }
        else {
            const findData = data[id].slice((page - 1) * numOfShow, page * numOfShow);
            const sendData = {
                data: findData,
                totalNums: data[id].length,
            };
            // 타임스탬프 추가
            if (lastModifiedTimestamp) {
                res.set("Last-Modified", lastModifiedTimestamp.toUTCString());
            }
            return res.status(201).json(sendData);
        }
    }
    else {
        return res.status(404).json({
            message: "Item not found",
        });
    }
});
exports.default = router;
