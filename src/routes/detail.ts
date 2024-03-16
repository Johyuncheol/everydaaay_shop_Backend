import express, { Request, Response } from "express";

const itemData = require("../json/item");
const askData = require("../json/ask");
const reviewData = require("../json/review");

const router = express.Router();

const generateDate_WidthoutMilisec = (): Date => {
  const dateWithoutMilliseconds = new Date();
  dateWithoutMilliseconds.setMilliseconds(0);
  return dateWithoutMilliseconds;
};

// 모든 영역의 마지막 수정 시간을 저장하기 위한 객체
const lastModifiedTimestamps = generateDate_WidthoutMilisec();

router.get("/", (req: Request, res: Response) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const id = url.searchParams.get("id");

  interface ItemRequire {
    id: string;
    imgSrc: string;
    brand: string;
    name: string;
    price: number;
    carouselImg: string[];
    detailImg: string;
    deliveryFee: number;
    noDeliveryPrice: number;
  }

  const findData = itemData.item.find((item: ItemRequire) => item.id === id);

  if (findData) {
    res.status(200).json({
      data: findData,
      message: "Success to get detail",
    });
  } else {
    res.status(404).json({
      message: "Item not found",
    });
  }
});

router.get("/ask", (req: Request, res: Response) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const id = url.searchParams.get("id") as string;
  const page = Number(url.searchParams.get("page"));
  const numOfShow = Number(url.searchParams.get("numOfShow"));

  const keys = Object.keys(askData);
  const data = askData as Record<
    string,
    {
      owner: string;
      date: string;
      state: boolean;
      title: string;
      detail: string;
    }[]
  >;

  if (keys.includes(id)) {
    console.log(data[id].length);
    if (page === 1) {
      const findData = data[id].slice(0, numOfShow);
      const sendData = {
        data: findData,
        totalNums: data[id].length,
      };
      return res.status(201).json(sendData);
    } else {
      const findData = data[id].slice((page - 1) * numOfShow, page * numOfShow);
      const sendData = {
        data: findData,
        totalNums: data[id].length,
      };

      return res.status(202).json(sendData);
    }
  } else {
    return res.status(404).json({
      message: "Item not found",
    });
  }
});

router.get("/review", (req: Request, res: Response) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const id = url.searchParams.get("id") as string;
  const page = Number(url.searchParams.get("page"));
  const numOfShow = Number(url.searchParams.get("numOfShow"));

  const keys = Object.keys(reviewData);
  console.log(keys.includes(id));

  const data = reviewData as Record<
    string,
    {
      star: number;
      date: string;
      option: string;
      user: string;
      detail: string;
      imgUrl: string;
    }[]
  >;

  if (keys.includes(id)) {
    if (page === 1) {
      const findData = data[id].slice(0, numOfShow);
      const sendData = {
        data: findData,
        totalNums: data[id].length,
      };
      return res.status(201).json(sendData);
    } else {
      const findData = data[id].slice((page - 1) * numOfShow, page * numOfShow);
      const sendData = {
        data: findData,
        totalNums: data[id].length,
      };

      return res.status(202).json(sendData);
    }
  } else {
    return res.status(404).json({
      message: "Item not found",
    });
  }
});

export default router;
