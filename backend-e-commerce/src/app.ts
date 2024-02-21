import express from "express";
import userRoute from "./routes/user.js";
import productRoute from "./routes/products.js";
import { connectDB } from "./utils/feature.js";
import { errorMiddleware } from "./middlewares/error.js";
import dotenv from "dotenv";
import morgan from "morgan";
import NodeCache from "node-cache";
dotenv.config();
connectDB();
export const myCache = new NodeCache();
const app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/uploads", express.static("uploads"));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`Server is on port : ${process.env.PORT}`);
});
