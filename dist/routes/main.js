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
require("dotenv").config();
const mongoose = require("mongoose");
const { MONGO_MAIN_URI } = process.env;
const connection2 = mongoose.createConnection(MONGO_MAIN_URI);
const router = express_1.default.Router();
const MainBannerSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    imgSrc: String,
    alt: String,
    detail: String,
});
const MainNavSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    imgSrc: String,
    alt: String,
    detail: String,
    linkSrc: String,
    widthRatio: String,
    aspectRatio: String,
});
const HotItemsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    brand: String,
    price: Number,
    imgSrc: String,
    alt: String,
});
const BannerItemsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    BannerItems: [
        {
            _id: mongoose.Schema.Types.ObjectId,
            name: String,
            brand: String,
            price: Number,
            imgSrc: String,
            alt: String,
        },
    ],
    Banner: [
        {
            _id: mongoose.Schema.Types.ObjectId,
            imgSrc: String,
            alt: String,
            linkSrc: String,
            detail: String,
            widthRatio: String,
            aspectRatio: String,
            elementRatio: String,
        },
    ],
});
//모델생성
const MainBanner = connection2.model("MainBanner", MainBannerSchema);
const MainNav = connection2.model("MainNav", MainNavSchema);
const HotItems = connection2.model("HotItems", HotItemsSchema);
const Recommend = connection2.model("Recommend", HotItemsSchema);
const BannerItems = connection2.model("BannerItems", BannerItemsSchema);
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
        if (ifModifiedSince &&
            new Date(ifModifiedSince) >= lastModifiedTimestamps[area]) {
            return res.status(304).send({
                data: null,
                status: `${area} is Not Modified`,
            });
        }
    }
    if (area === "first") {
        const mainData = {
            mainNav: yield MainNav.find({}),
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
            Exhibition: yield BannerItems.findOne({}),
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
router.get("/dashboard", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const area = url.searchParams.get("area");
    // Cache-Control: no-cache 헤더 확인
    if (req.get("Cache-Control") === "no-cache" && req.get("If-Modified-Since")) {
        // Last-Modified 헤더 확인
        const ifModifiedSince = req.get("If-Modified-Since");
        // 클라이언트에서 전송한 If-Modified-Since 값이 있고,
        // 해당 값이 해당 영역의 마지막 수정 시간보다 크거나 같으면 304 Not Modified 응답
        if (ifModifiedSince &&
            new Date(ifModifiedSince) >= lastModifiedTimestamps[area]) {
            return res.status(304).send({
                data: null,
                status: `${area} is Not Modified`,
            });
        }
    }
    if (area === "mainCarousel") {
        console.log(123);
        const mainData = {
            MainBanner: yield MainBanner.find({}),
            ColumnLabels: ["_id", "imgSrc", "alt", "detail"],
        };
        // 해당 영역의 응답을 전송하기 전에 마지막 수정 시간 업데이트
        res.set("Last-Modified", lastModifiedTimestamps.first.toUTCString());
        //lastModifiedTimestamps.first = new Date();
        return res.status(201).send({
            data: mainData,
            status: "Success to get main mainCarousel",
        });
    }
    else if (area === "mainNav") {
        const mainData = {
            MainNav: yield MainNav.find({}),
            ColumnLabels: [
                "_id",
                "imgSrc",
                "alt",
                "detail",
                "linkSrc",
                "widthRatio",
                "aspectRatio",
            ],
        };
        // 해당 영역의 응답을 전송하기 전에 마지막 수정 시간 업데이트
        res.set("Last-Modified", lastModifiedTimestamps.second.toUTCString());
        //lastModifiedTimestamps.second = new Date();
        return res.status(201).send({
            data: mainData,
            status: "Success to get main mainNav",
        });
    }
    else if (area === "hotItems") {
        const mainData = {
            HotItems: yield HotItems.find({}),
            ColumnLabels: ["_id", "name", "brand", "price", "imgSrc", "alt"],
        };
        // 해당 영역의 응답을 전송하기 전에 마지막 수정 시간 업데이트
        res.set("Last-Modified", lastModifiedTimestamps.third.toUTCString());
        return res.status(201).send({
            data: mainData,
            status: "Success to get main hotItems",
        });
    }
    else if (area === "recommend") {
        const mainData = {
            Recommend: yield Recommend.find({}),
            ColumnLabels: ["_id", "name", "brand", "price", "imgSrc", "alt"],
        };
        // 해당 영역의 응답을 전송하기 전에 마지막 수정 시간 업데이트
        res.set("Last-Modified", lastModifiedTimestamps.third.toUTCString());
        return res.status(201).send({
            data: mainData,
            status: "Success to get main recommend",
        });
    }
    else if (area === "banner") {
        const data = yield BannerItems.findOne({});
        const BannerData = data.Banner;
        const mainData = {
            Banner: BannerData,
            BannerLabels: [
                "_id",
                "imgSrc",
                "alt",
                "linkSrc",
                "detail",
                "aspectRatio",
                "widthRatio",
                "elementRatio",
            ],
        };
        // 해당 영역의 응답을 전송하기 전에 마지막 수정 시간 업데이트
        res.set("Last-Modified", lastModifiedTimestamps.third.toUTCString());
        return res.status(201).send({
            data: mainData,
            status: "Success to get main banner",
        });
    }
    else if (area === "bannerItems") {
        const data = yield BannerItems.findOne({});
        const BannerItemsData = data.BannerItems;
        const mainData = {
            BannerItems: BannerItemsData,
            ColumnLabels: ["_id", "name", "brand", "price", "imgSrc", "alt"],
        };
        // 해당 영역의 응답을 전송하기 전에 마지막 수정 시간 업데이트
        res.set("Last-Modified", lastModifiedTimestamps.third.toUTCString());
        return res.status(201).send({
            data: mainData,
            status: "Success to get main bannerItems",
        });
    }
    else {
        return res.status(404).send({
            status: "not found data",
        });
    }
}));
//////////////////////////////////////////////////
/* 대시보드에서 수정 및 생성 */
//////////////////////////////////////////////////
router.post("/dashboard", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const area = url.searchParams.get("area");
    if (area === "mainCarousel") {
        if (!req.body._id) {
            const newMainBanner = new MainBanner({
                _id: new mongoose.Types.ObjectId(),
                imgSrc: req.body.imgSrc,
                alt: req.body.alt,
                detail: req.body.detail,
            });
            const savedNewMainBanner = yield newMainBanner.save();
            lastModifiedTimestamps.first = generateDate_WidthoutMilisec();
            return res.status(201).json({ message: `save ${area}` });
        }
        const updatedBanner = yield MainBanner.findByIdAndUpdate(req.body._id, { imgSrc: req.body.imgSrc, alt: req.body.alt, detail: req.body.detail } // 업데이트할 필드 및 값
        );
        if (!updatedBanner) {
            return res.status(404).json({ message: "Banner not found" });
        }
        // 마지막 수정 시간 업데이트
        lastModifiedTimestamps.first = generateDate_WidthoutMilisec();
        return res.status(201).json({ message: `update ${area}` });
    }
    else if (area === "mainNav") {
        if (!req.body._id) {
            const newMainNav = new MainNav({
                _id: new mongoose.Types.ObjectId(),
                imgSrc: req.body.imgSrc,
                alt: req.body.alt,
                detail: req.body.detail,
                linkSrc: req.body.linkSrc,
                widthRatio: req.body.widthRatio,
                aspectRatio: req.body.aspectRatio,
            });
            const savedNewMainNav = yield newMainNav.save();
            return res.status(201).json({ message: `save ${area}` });
        }
        const updatedMainNav = yield MainNav.findByIdAndUpdate(req.body._id, {
            imgSrc: req.body.imgSrc,
            alt: req.body.alt,
            detail: req.body.detail,
            linkSrc: req.body.linkSrc,
            widthRatio: req.body.widthRatio,
            aspectRatio: req.body.aspectRatio,
        } // 업데이트할 필드 및 값
        );
        if (!updatedMainNav) {
            return res.status(404).json({ message: "MainNav not found" });
        }
        // 마지막 수정 시간 업데이트
        lastModifiedTimestamps.first = generateDate_WidthoutMilisec();
        return res.status(201).json({ message: `update ${area}` });
    }
    else if (area === "hotItems") {
        if (!req.body._id) {
            const newHotItems = new HotItems({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                brand: req.body.brand,
                price: req.body.price,
                imgSrc: req.body.imgSrc,
                alt: req.body.alt,
            });
            const savedNewHotItems = yield newHotItems.save();
            return res.status(201).json({ message: `save ${area}` });
        }
        const updatedHotItems = yield HotItems.findByIdAndUpdate(req.body._id, {
            name: req.body.name,
            brand: req.body.brand,
            price: req.body.price,
            imgSrc: req.body.imgSrc,
            alt: req.body.alt,
        } // 업데이트할 필드 및 값
        );
        if (!updatedHotItems) {
            return res.status(404).json({ message: "HotItems not found" });
        }
        // 마지막 수정 시간 업데이트
        lastModifiedTimestamps.second = generateDate_WidthoutMilisec();
        return res.status(201).json({ message: `update ${area}` });
    }
    else if (area === "recommend") {
        if (!req.body._id) {
            const newRecommend = new Recommend({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                brand: req.body.brand,
                price: req.body.price,
                imgSrc: req.body.imgSrc,
                alt: req.body.alt,
            });
            const savedNewRecommend = yield newRecommend.save();
            return res.status(201).json({ message: `save ${area}` });
        }
        const updatedRecommend = yield Recommend.findByIdAndUpdate(req.body._id, {
            name: req.body.name,
            brand: req.body.brand,
            price: req.body.price,
            imgSrc: req.body.imgSrc,
            alt: req.body.alt,
        } // 업데이트할 필드 및 값
        );
        if (!updatedRecommend) {
            return res.status(404).json({ message: "Recommend not found" });
        }
        // 마지막 수정 시간 업데이트
        lastModifiedTimestamps.second = generateDate_WidthoutMilisec();
        return res.status(201).json({ message: `update ${area}` });
    }
    else if (area === "bannerItems" || area === "banner") {
        if (!req.body._id) {
            const newBannerItems = new BannerItems(Object.assign({ _id: new mongoose.Types.ObjectId() }, req.body));
            const savedNewBannerItems = yield newBannerItems.save();
            return res.status(201).json({ message: `save ${area}` });
        }
        const bannerItemToUpdate = yield BannerItems.findById("6606ce9f4f639ae970c2210e");
        if (bannerItemToUpdate) {
            // Banner 배열에서 _id가 일치하는 객체 찾기
            let bannerToUpdate;
            if (area === "banner") {
                bannerToUpdate = bannerItemToUpdate.Banner.find((banner) => banner._id == req.body._id);
            }
            else if (area === "bannerItems") {
                bannerToUpdate = bannerItemToUpdate.BannerItems.find((banner) => banner._id == req.body._id);
            }
            if (bannerToUpdate) {
                Object.keys(req.body).forEach((key) => {
                    if (key !== "_id") {
                        // _id 필드는 업데이트하지 않음
                        bannerToUpdate[key] = req.body[key];
                    }
                });
                // 변경사항 저장
                yield bannerItemToUpdate.save();
                console.log("Banner item updated successfully");
            }
            else {
                console.log("Banner item not found");
            }
        }
        else {
            console.log("Document not found");
        }
        // 마지막 수정 시간 업데이트
        lastModifiedTimestamps.third = generateDate_WidthoutMilisec();
        return res.status(201).json({ message: `update ${area}` });
    }
    else {
        return res.status(404).send({
            status: "not found data",
        });
    }
}));
//////////////////////////////////////////////////
/* 대시보드에서 삭제 */
//////////////////////////////////////////////////
router.delete("/dashboard", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const area = url.searchParams.get("area");
    if (area === "mainCarousel") {
        for (const key in req.body) {
            console.log(req.body[key]);
            const result = yield MainBanner.findByIdAndDelete({ _id: req.body[key] });
        }
        // 마지막 수정 시간 업데이트
        lastModifiedTimestamps.first = generateDate_WidthoutMilisec();
        return res.status(201).json({ message: `delete ${area}` });
    }
    else if (area === "mainNav") {
        for (const key in req.body) {
            console.log(req.body[key]);
            const result = yield MainNav.findByIdAndDelete({ _id: req.body[key] });
        }
        // 마지막 수정 시간 업데이트
        lastModifiedTimestamps.first = generateDate_WidthoutMilisec();
        return res.status(201).json({ message: `delete ${area}` });
    }
    else if (area === "hotItems") {
        for (const key in req.body) {
            console.log(req.body[key]);
            const result = yield HotItems.findByIdAndDelete({ _id: req.body[key] });
        }
        // 마지막 수정 시간 업데이트
        lastModifiedTimestamps.second = generateDate_WidthoutMilisec();
        return res.status(201).json({ message: `delete ${area}` });
    }
    else if (area === "recommend") {
        for (const key in req.body) {
            console.log(req.body[key]);
            const result = yield Recommend.findByIdAndDelete({ _id: req.body[key] });
        }
        // 마지막 수정 시간 업데이트
        lastModifiedTimestamps.second = generateDate_WidthoutMilisec();
        return res.status(201).json({ message: `delete ${area}` });
    }
    else if (area === "bannerItems" || area === "banner") {
        const bannerItemToUpdate = yield BannerItems.findById("6606ce9f4f639ae970c2210e");
        if (bannerItemToUpdate) {
            let bannerArray;
            if (area === "banner") {
                bannerArray = bannerItemToUpdate.Banner;
            }
            else if (area === "bannerItems") {
                bannerArray = bannerItemToUpdate.BannerItems;
            }
            else
                return console.log(`${area} not found`);
            console.log(req.body);
            let indexToRemove;
            for (const key in req.body) {
                console.log(req.body[key]);
                indexToRemove = bannerArray.findIndex((banner) => banner._id == req.body[key]);
                if (indexToRemove !== -1) {
                    bannerArray.splice(indexToRemove, 1); // 해당 인덱스의 객체를 삭제합니다.
                    yield bannerItemToUpdate.save(); // 변경사항 저장
                    console.log("Banner item deleted successfully");
                }
            }
            if (indexToRemove === -1) {
                console.log("Banner item not found");
            }
        }
        else {
            console.log("Document not found");
        }
        // 마지막 수정 시간 업데이트
        lastModifiedTimestamps.third = generateDate_WidthoutMilisec();
        return res.status(201).json({ message: `delete ${area}` });
    }
    else {
        return res.status(404).send({
            status: "not found data",
        });
    }
}));
exports.default = router;
