import express, { Request, Response } from "express";

const searchData = require("../json/search");

const router = express.Router();

router.get("/", (req: Request, res: Response) => {

  const url = new URL(req.url!, `http://${req.headers.host}`);
  const text = url.searchParams.get("text") as string;
  const page = Number(url.searchParams.get("page"));

  const searchResult = searchData.filter((item: any) => item.name.includes(text));
  console.log(searchResult)
  return res.status(201).send({
    data: searchResult,
    status: "Success to get main",
  });
});

export default router;
