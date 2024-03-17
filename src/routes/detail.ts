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

// 카테고리와 디테일별 마지막 수정 시간을 저장하기 위한 객체
interface LastModifiedTimestamps {
  [category: string]: {
    [detail: string]: Date;
  };
}

let lastModifiedTimestamps: LastModifiedTimestamps = {};

router.get("/", (req: Request, res: Response) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const id = url.searchParams.get("id");

  let lastModifiedTimestamp;
  if (id) {
    if (lastModifiedTimestamps[id] === undefined) {
      lastModifiedTimestamps[id] = { [id]: generateDate_WidthoutMilisec() };
    }

    lastModifiedTimestamp = lastModifiedTimestamps[id][id]; // 수정된 부분
  }

  if (req.get("Cache-Control") === "no-cache" && req.get("If-Modified-Since")) {
    // Last-Modified 헤더 확인
    const ifModifiedSince = req.get("If-Modified-Since");
    // 클라이언트에서 전송한 If-Modified-Since 값이 있고,
    // 해당 값이 해당 영역의 마지막 수정 시간보다 크거나 같으면 304 Not Modified 응답
    if (
      ifModifiedSince &&
      lastModifiedTimestamp &&
      new Date(ifModifiedSince) >= lastModifiedTimestamp
    ) {
      return res.status(304).send({
        data: null,
        status: `${id} is Not Modified`,
      });
    }
  }

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
    // 해당 영역의 응답을 전송하기 전에 마지막 수정 시간 업데이트
    if (lastModifiedTimestamp) {
      res.set("Last-Modified", lastModifiedTimestamp.toUTCString());
    }

    res.status(201).json({
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

  let lastModifiedTimestamp;

  const TimeStampKey = `ask_${id}`;
  if (id) {
    if (lastModifiedTimestamps[TimeStampKey] === undefined) {
      lastModifiedTimestamps[TimeStampKey] = {
        [TimeStampKey]: generateDate_WidthoutMilisec(),
      };
    }

    lastModifiedTimestamp = lastModifiedTimestamps[TimeStampKey][TimeStampKey]; // 수정된 부분
  }

  if (req.get("Cache-Control") === "no-cache" && req.get("If-Modified-Since")) {
    // Last-Modified 헤더 확인
    const ifModifiedSince = req.get("If-Modified-Since");
    // 클라이언트에서 전송한 If-Modified-Since 값이 있고,
    // 해당 값이 해당 영역의 마지막 수정 시간보다 크거나 같으면 304 Not Modified 응답
    if (
      ifModifiedSince &&
      lastModifiedTimestamp &&
      new Date(ifModifiedSince) >= lastModifiedTimestamp
    ) {
      return res.status(304).send({
        data: null,
        status: `${TimeStampKey} is Not Modified`,
      });
    }
  }

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
    } else {
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

  let lastModifiedTimestamp;

  const TimeStampKey = `review_${id}`;
  if (id) {
    if (lastModifiedTimestamps[TimeStampKey] === undefined) {
      lastModifiedTimestamps[TimeStampKey] = {
        [TimeStampKey]: generateDate_WidthoutMilisec(),
      };
    }

    lastModifiedTimestamp = lastModifiedTimestamps[TimeStampKey][TimeStampKey]; // 수정된 부분
  }

  if (req.get("Cache-Control") === "no-cache" && req.get("If-Modified-Since")) {
    // Last-Modified 헤더 확인
    const ifModifiedSince = req.get("If-Modified-Since");
    // 클라이언트에서 전송한 If-Modified-Since 값이 있고,
    // 해당 값이 해당 영역의 마지막 수정 시간보다 크거나 같으면 304 Not Modified 응답
    if (
      ifModifiedSince &&
      lastModifiedTimestamp &&
      new Date(ifModifiedSince) >= lastModifiedTimestamp
    ) {
      return res.status(304).send({
        data: null,
        status: `${TimeStampKey} is Not Modified`,
      });
    }
  }

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
      // 타임스탬프 추가
      if (lastModifiedTimestamp) {
        res.set("Last-Modified", lastModifiedTimestamp.toUTCString());
      }
      return res.status(201).json(sendData);
    } else {
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
  } else {
    return res.status(404).json({
      message: "Item not found",
    });
  }
});

export default router;
