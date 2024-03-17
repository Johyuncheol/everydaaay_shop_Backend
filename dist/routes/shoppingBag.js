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
const shoppingBagData = require("../json/shoppingBag");
const router = express_1.default.Router();
const mongoose = require("mongoose");
const { MONGO_USER_URI } = process.env;
const connection1 = mongoose.createConnection(MONGO_USER_URI, {
/*   useNewUrlParser: true,
useUnifiedTopology: true, */
});
// 타입 지정
const UserSchema = new mongoose.Schema({
    id: String,
    password: String,
    name: String,
    bag: Array,
});
const User = connection1.model("User", UserSchema);
const generateDate_WidthoutMilisec = () => {
    const dateWithoutMilliseconds = new Date();
    dateWithoutMilliseconds.setMilliseconds(0);
    return dateWithoutMilliseconds;
};
// 마지막 수정 시간을 저장하기 위한 객체
let lastModifiedTimestamps = generateDate_WidthoutMilisec();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    const accessID = cookies.accessToken.split("-")[0];
    const user = yield User.findOne({ id: accessID });
    // Cache-Control: no-cache 헤더 확인
    if (req.get("Cache-Control") === "no-cache" && req.get("If-Modified-Since")) {
        // Last-Modified 헤더 확인
        const ifModifiedSince = req.get("If-Modified-Since");
        // 클라이언트에서 전송한 If-Modified-Since 값이 있고,
        // 해당 값이 해당 영역의 마지막 수정 시간보다 크거나 같으면 304 Not Modified 응답
        if (ifModifiedSince &&
            new Date(ifModifiedSince) >= lastModifiedTimestamps) {
            return res.status(304).send({
                data: null,
                status: `cart is Not Modified`,
            });
        }
    }
    // 해당 영역의 응답을 전송하기 전에 마지막 수정 시간 업데이트
    res.set("Last-Modified", lastModifiedTimestamps.toUTCString());
    return res.status(201).send({
        data: user.bag,
        status: "Success to get main",
    });
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(123);
    const cookies = req.cookies;
    if (!cookies.accessToken) {
        return res.status(401).send({
            status: "로그인을 확인해주세요",
        });
    }
    const accessID = cookies.accessToken.split("-")[0];
    const data = req.body;
    // $set 연산자를 사용하여 필드 값 업데이트
    const updateOperation = {
        $set: { bag: data },
    };
    yield User.updateOne({ id: accessID }, updateOperation);
    // 데이터가 수정되면 타임스탬프 업데이트
    lastModifiedTimestamps = generateDate_WidthoutMilisec();
    return res.status(201).send({
        status: "장바구니 담기 성공",
    });
}));
exports.default = router;
