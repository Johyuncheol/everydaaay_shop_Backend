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
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(201).send({
        data: shoppingBagData,
        status: "Success to get main",
    });
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    return res.status(201).send({
        status: "장바구니 담기 성공",
    });
}));
exports.default = router;
