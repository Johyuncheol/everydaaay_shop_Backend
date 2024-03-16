import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import authRouter from "../src/routes/auth";
import detailRouter from "../src/routes/detail";
import mainRouter from "../src/routes/main";
import shoppingBagRouter from "../src/routes/shoppingBag";
import categoryRouter from "../src/routes/category";
import searchRouter from "../src/routes/search";
require("dotenv").config();

const app: Application = express();
const cors = require("cors");
const port = 8080;

app.use(
  cors({
    origin: [
      "http://localhost:3002",
      
      "https://everydaaay.com",

      "https://category.everydaaay.com",
      "https://detail.everydaaay.com",
      
      "https://contents.everydaaay.com",

      "https://buy.everydaaay.com",

      "https://auth.everydaaay.com",

      
      "http://localhost:3003",
      "http://localhost:3002",
      "http://localhost:3000"
      /* "http://localhost:3004", */
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});

///////////////////////////////////
// 라우터

app.use("/api/auth", authRouter);
app.use("/api/detail", detailRouter);
app.use("/api/main", mainRouter);
app.use("/api/shoppingBag", shoppingBagRouter);
app.use("/api/category", categoryRouter);
app.use("/api/search", searchRouter);

/////////////////////////////////////
