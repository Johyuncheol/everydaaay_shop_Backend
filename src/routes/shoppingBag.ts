import express, { Request, Response } from "express";

const shoppingBagData = require("../json/shoppingBag");

const router = express.Router();
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

router.get("/", async (req: Request, res: Response) => {
  return res.status(201).send({
    data: shoppingBagData,
    status: "Success to get main",
  });
});

router.post("/", async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies.accessToken) {
    return res.status(401).send({
      status: "로그인을 확인해주세요",
    });
  }

  const accessID = cookies.accessToken.split("-")[0];
  const data: string = req.body;

  // $set 연산자를 사용하여 필드 값 업데이트
  const updateOperation = {
    $set: { bag: data },
  };

  await User.updateOne({ id: accessID }, updateOperation);

  return res.status(201).send({
    status: "장바구니 담기 성공",
  });
});
export default router;
