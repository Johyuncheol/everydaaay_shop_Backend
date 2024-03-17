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

// 카테고리와 디테일별 마지막 수정 시간을 저장하기 위한 객체
interface LastModifiedTimestamps {
  [category: string]: {
    [detail: string]: Date;
  };
}

let lastModifiedTimestamps: LastModifiedTimestamps = {
  women: {
    all: generateDate_WidthoutMilisec(),
    outer: generateDate_WidthoutMilisec(),
    top: generateDate_WidthoutMilisec(),
    bottom: generateDate_WidthoutMilisec(),
  },
  man: {
    all: generateDate_WidthoutMilisec(),
    outer: generateDate_WidthoutMilisec(),
    top: generateDate_WidthoutMilisec(),
    bottom: generateDate_WidthoutMilisec(),
  },
  interior: {
    all: generateDate_WidthoutMilisec(),
    livingRoom: generateDate_WidthoutMilisec(),
    bedroom: generateDate_WidthoutMilisec(),
    kitchen: generateDate_WidthoutMilisec(),
  },
};

router.get("/:category/:detail", (req: Request, res: Response) => {

  const category = req.params.category as string;
  const detail = req.params.detail as string;
  const lastModifiedTimestamp = lastModifiedTimestamps[category]?.[detail];


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

  const url = new URL(req.url!, `http://${req.headers.host}`);
  const page = Number(url.searchParams.get("page"));
  const numOfShow = Number(url.searchParams.get("numOfShow"));


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

    return res.status(202).json(sendData);
  }
});

export default router;
