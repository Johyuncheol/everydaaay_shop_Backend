"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const popular = require("../json/popular");
const exhibition = require("../json/exhibition");
const mainNav = require("../json/mainNav");
require("dotenv").config();
const mongoose = require("mongoose");
const { MONGO_MAIN_URI } = process.env;
const connection2 = mongoose.createConnection(MONGO_MAIN_URI, {
/*   useNewUrlParser: true,
useUnifiedTopology: true, */
});
const router = express_1.default.Router();
const ItemSchema = new mongoose.Schema({
    id: String,
    imgSrc: String,
    smallImgSrc1: String,
    smallImgSrc2: String,
    smallImgSrc3: String,
});
const Item1Schema = new mongoose.Schema({
    id: String,
    imgSrc: String,
});
//모델생성
const MainBanner = connection2.model("MainBanner", ItemSchema);
//const Popular = connection2.model("Popular", Item1Schema);
//const PopularRelated = connection2.model("PopularRelated", Item1Schema);
/* const Recommend = connection2.model("Recommend", Item1Schema);
const RecommendRelated = connection2.model("RecommendRelated", Item1Schema);
const Sale = connection2.model("Sale", Item1Schema);
const SaleRelated = connection2.model("SaleRelated", Item1Schema); */
const generateDate_WidthoutMilisec = () => {
    const dateWithoutMilliseconds = new Date();
    dateWithoutMilliseconds.setMilliseconds(0);
    return dateWithoutMilliseconds;
};
// 모든 영역의 마지막 수정 시간을 저장하기 위한 객체
const lastModifiedTimestamps = {
    first: generateDate_WidthoutMilisec(),
    second: generateDate_WidthoutMilisec(),
    third: generateDate_WidthoutMilisec(),
};
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const area = url.searchParams.get("area");
    // Cache-Control: no-cache 헤더 확인
    if (req.get("Cache-Control") === "no-cache" && req.get("If-Modified-Since")) {
        // Last-Modified 헤더 확인
        const ifModifiedSince = req.get("If-Modified-Since");
        // 클라이언트에서 전송한 If-Modified-Since 값이 있고,
        // 해당 값이 해당 영역의 마지막 수정 시간보다 크거나 같으면 304 Not Modified 응답
        if (ifModifiedSince && new Date(ifModifiedSince) >= lastModifiedTimestamps[area]) {
            return res.status(304).send({
                data: null,
                status: `${area} is Not Modified`,
            });
        }
    }
    if (area === "first") {
        const mainData = {
            mainNav: mainNav,
            MainBanner: yield MainBanner.find({}),
        };
        // 해당 영역의 응답을 전송하기 전에 마지막 수정 시간 업데이트
        res.set("Last-Modified", lastModifiedTimestamps.first.toUTCString());
        //lastModifiedTimestamps.first = new Date();
        return res.status(201).send({
            data: mainData,
            status: "Success to get main firstArea",
        });
    }
    else if (area === "second") {
        const mainData = {
            Popular: popular,
        };
        // 해당 영역의 응답을 전송하기 전에 마지막 수정 시간 업데이트
        res.set("Last-Modified", lastModifiedTimestamps.second.toUTCString());
        //lastModifiedTimestamps.second = new Date();
        return res.status(201).send({
            data: mainData,
            status: "Success to get main secondArea",
        });
    }
    else if (area === "third") {
        const mainData = {
            Exhibition: exhibition,
        };
        // 해당 영역의 응답을 전송하기 전에 마지막 수정 시간 업데이트
        res.set("Last-Modified", lastModifiedTimestamps.third.toUTCString());
        //lastModifiedTimestamps.third = new Date();
        return res.status(201).send({
            data: mainData,
            status: "Success to get main thirdArea",
        });
    }
    else {
        return res.status(404).send({
            status: "not found data",
        });
    }
}));
exports.default = router;
