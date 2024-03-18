import express, { Request, Response } from "express";

const womenData = require("../json/women");
const manData = require("../json/man");
const interiorData = require("../json/interior");

const router = express.Router();

const generateDate_WidthoutMilisec = (): Date => {
  const dateWithoutMilliseconds = new Date();
  dateWithoutMilliseconds.setMilliseconds(0);
  return dateWithoutMilliseconds;
};

//  카테고리 타임스탬프 타입
interface LastModifiedTimestamps {
  [timestampKey: string]: Date;
}

let lastModifiedTimestamps: LastModifiedTimestamps = {};

router.get("/:category/:detail", (req: Request, res: Response) => {
  const category = req.params.category as string;
  const detail = req.params.detail as string;

  const url = new URL(req.url!, `http://${req.headers.host}`);
  const page = Number(url.searchParams.get("page"));
  const numOfShow = Number(url.searchParams.get("numOfShow"));

  let lastModifiedTimestamp;

  const TimeStampKey = `${category}_${detail}_${page}`;

  if (lastModifiedTimestamps[TimeStampKey] === undefined) {
    lastModifiedTimestamps[TimeStampKey] = generateDate_WidthoutMilisec();
  }

  lastModifiedTimestamp = lastModifiedTimestamps[TimeStampKey];

  if (req.get("Cache-Control") === "no-cache" && req.get("If-Modified-Since")) {
    // Last-Modified 헤더 확인
    const ifModifiedSince = req.get("If-Modified-Since");
    // 클라이언트에서 전송한 If-Modified-Since 값이 있고,
    // 해당 값이 해당 영역의 마지막 수정 시간보다 크거나 같으면 304 Not Modified 응답
    if (ifModifiedSince && new Date(ifModifiedSince) >= lastModifiedTimestamp) {
      return res.status(304).send({
        data: null,
        status: `${category}/${detail} is Not Modified`,
      });
    }
  }

  // 해당 영역의 응답을 전송하기 전에 마지막 수정 시간 업데이트
  res.set("Last-Modified", lastModifiedTimestamp.toUTCString());

  interface Item {
    id: number;
    imgSrc: string;
    brand: string;
    name: string;
    price: number;
    deliveryFee: number;
    noDeliveryPrice: number;
  }

  interface ResponseData {
    data: Item[];
    totalNums: number;
  }

  /*  const category = req.params.category as string;
  const detail = req.params.detail as keyof WomenData; */

  let data: Item[] = [];

  if (category === "women") {
    data = womenData[detail] || [];
  } else if (category === "man") {
    data = manData[detail] || [];
  } else if (category === "interior") {
    data = interiorData[detail] || [];
  }

  console.log(data.length);
  if (page === 1) {
    const findData = data.slice(0, page * numOfShow);
    const sendData: ResponseData = {
      data: findData,
      totalNums: data.length,
    };

    return res.status(201).json(sendData);
  } else {
    const findData = data.slice((page - 1) * numOfShow, page * numOfShow);
    const sendData: ResponseData = {
      data: findData,
      totalNums: data.length,
    };

    return res.status(201).json(sendData);
  }
});

export default router;
