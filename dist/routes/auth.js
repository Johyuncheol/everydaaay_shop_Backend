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
require("dotenv").config();
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
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.id;
    const userPW = req.body.password;
    const user = yield User.findOne({ id: userId });
    if (user) {
        if (user.password === userPW) {
            const resdata = { name: user.name, bag: user.bag };
            const kr = 9 * 60 * 60 * 1000;
            // 엑세스토큰 유효기간 15분
            res.cookie("accessToken", `${userId}-access`, {
                secure: true,
                httpOnly: true,
                expires: new Date(Date.now() + kr + 15 * 60 * 1000),
                sameSite: "none",
            });
            //리프레시 토큰 유효기간 30분
            res.cookie("refreshToken", `${userId}-refresh`, {
                secure: true,
                httpOnly: true,
                expires: new Date(Date.now() + kr + 30 * 60 * 1000),
                sameSite: "none",
            });
            //민감하지않은 정보인 이름 전달
            res.cookie("name", `${user.name}`, {
                secure: true,
                expires: new Date(Date.now() + kr + 15 * 60 * 1000),
                sameSite: "none",
            });
            //개인정보구분 데이터
            res.cookie("user_id", `${user._id}`, {
                secure: true,
                httpOnly: true,
                expires: new Date(Date.now() + kr + 15 * 60 * 1000),
                sameSite: "none",
            });
            return res.status(201).send({
                data: resdata,
                status: "Success Login",
            });
        }
        else {
            return res.status(202).send({
                data: null,
                status: "비밀번호가 일치하지 않습니다",
            });
        }
    }
    else {
        return res.status(203).send({
            data: null,
            status: "존재하지 않는 유저입니다",
        });
    }
}));
router.post("/isLogin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookies = req.cookies;
    // 리프레시토큰이 만료되거나 다른경우
    if (cookies.refreshToken) {
        const refreshID = cookies.refreshToken.split("-")[0];
        const user = yield User.findOne({ id: refreshID });
        if (!user)
            return res.status(204).send({ status: "Need Login" });
        // 리프레시토큰은 유효, 엑세스토큰이 만료되어 사라진 경우
        if (!cookies.accessToken) {
            return res.status(204).send({ status: "Need Login" });
        }
        // 엑세스토큰 리프레시 토큰이 모두 유효
        if (cookies.accessToken) {
            const accessID = cookies.accessToken.split("-")[0];
            // 엑세스토큰 리프레시토큰의 소유주가 다를 때
            if (refreshID !== accessID)
                return res.status(204).send({ status: "Need Login" });
            // 정상적인 토큰으로 엑세스토큰 재발급시
            const user = yield User.findOne({ id: accessID });
            //엑세스토큰을 사용 유저 닉네임 추출
            const resdata = { name: user.name };
            const kr = 9 * 60 * 60 * 1000;
            // 엑세스토큰 유효기간 15분
            res.cookie("accessToken", `${accessID}-access`, {
                secure: true,
                httpOnly: true,
                expires: new Date(Date.now() + kr + 15 * 60 * 1000),
                sameSite: "none",
            });
            return res.status(201).json({
                data: resdata,
                status: "Logined",
            });
        }
    }
    else {
        return res.status(204).send({ status: "Need Login" });
    }
}));
router.post("/logout", (req, res) => {
    res.cookie("accessToken", "access", {
        secure: true,
        httpOnly: true,
        expires: new Date("1997-04-22T00:00:00Z"), // 유효기간을 지난날짜로 설정 (토큰삭제)
        sameSite: "none",
    });
    res.cookie("refreshToken", "refresh", {
        secure: true,
        httpOnly: true,
        expires: new Date("1997-04-22T00:00:00Z"), // 유효기간을 지난날짜로 설정 (토큰삭제)
        sameSite: "none",
    });
    res.status(201).json({
        message: "Success to logout",
    });
});
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.id;
    const userPW = req.body.password;
    const userNickName = req.body.nickName;
    // 비동기적으로 find를 수행하고 결과를 기다림
    const existingUser = yield User.find({ id: userId });
    // 이미 존재하는 유저(id)일 때
    if (existingUser.length > 0) {
        return res.status(201).send({
            data: null,
            status: "already exist user",
        });
    }
    //객체 생성
    const me = new User({
        id: userId,
        password: userPW,
        name: userNickName,
        bag: [],
    });
    me.save()
        .then(() => {
        console.log(me);
    })
        .catch((err) => {
        console.log("Error : " + err);
    });
    return res.status(201).send({
        data: null,
        status: "Success to get register",
    });
}));
exports.default = router;
