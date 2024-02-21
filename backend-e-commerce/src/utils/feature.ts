import mongoose from "mongoose";

export const connectDB = () => {
  const uri = process.env.MONGO_URI || "";
  mongoose.connect(uri).then(() => {
    console.log("database connected successfully");
  });
};
