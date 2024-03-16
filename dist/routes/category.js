"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const womenData = require("../json/women");
const manData = require("../json/man");
const interiorData = require("../json/interior");
const router = express_1.default.Router();
router.get("/:category/:detail", (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const page = Number(url.searchParams.get("page"));
    const numOfShow = Number(url.searchParams.get("numOfShow"));
    const category = req.params.category;
    const detail = req.params.detail;
    let data = [];
    if (category === "women") {
        data = womenData[detail] || [];
    }
    else if (category === "man") {
        data = manData[detail] || [];
    }
    else if (category === "interior") {
        data = interiorData[detail] || [];
    }
    console.log(data.length);
    if (page === 1) {
        const findData = data.slice(0, page * numOfShow);
        const sendData = {
            data: findData,
            totalNums: data.length,
        };
        return res.status(201).json(sendData);
    }
    else {
        const findData = data.slice((page - 1) * numOfShow, page * numOfShow);
        const sendData = {
            data: findData,
            totalNums: data.length,
        };
        return res.status(202).json(sendData);
    }
});
exports.default = router;
