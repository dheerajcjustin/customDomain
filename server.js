import express from "express";
import "dotenv/config";
import homeRouter from "./routes/homeRoutes.js";
import mongooseConnect from "./config/mongooseConnect.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import morgan from "morgan";

const app = express();

const port = process.env.port || 5000;
app.use(morgan("dev"));

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use("/", homeRouter);

mongooseConnect();

app.listen(port, () => {
  console.log("server run ayye !!!! at http://localhost:" + port + "/");
});
