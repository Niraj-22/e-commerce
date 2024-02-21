import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

export const adminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;
  if (!id) return next(new ErrorHandler("Login first", 401));
  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("Id doesn't exist", 401));
  if (user.role !== "admin")
    return next(
      new ErrorHandler("You don't have access to perform this task", 401)
    );
  next();
});
