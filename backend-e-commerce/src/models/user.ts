import mongoose from "mongoose";
import validator from "validator";
interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: "admin" | "user";
  gender: "male" | "female";
  dob: Date;
  createdAt: Date;
  updatedAt: Date;

  age: number;
}

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "Please enter Id"],
    },
    name: {
      type: String,
      required: [true, "Please enter Name"],
    },
    email: {
      type: String,
      unique: [true, "Email Already exists"],
      required: [true, "Please enter email"],
      validate: validator.default.isEmail,
    },
    photo: {
      type: String,
      required: [true, "Please add photo"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Please add gender"],
    },
    dob: {
      type: Date,
      required: [true, "Please add DOB"],
    },
  },
  { timestamps: true }
);
schema.virtual("age").get(function () {
  const today = new Date();
  const dob: any = this.dob;
  let age: any = today.getFullYear() - dob.getFullYear();

  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() < dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
});
export const User = mongoose.model<IUser>("User", schema);
