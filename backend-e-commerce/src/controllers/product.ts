import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/feature.js";

export const getLatestProducts = TryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    let products;
    if (myCache.has("latest-products"))
      products = JSON.parse(myCache.get("latest-products") as string);
    else {
      products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
      myCache.set("latest-products", JSON.stringify(products));
    }
    return res.status(200).json({ success: true, products });
  }
);

export const getAllCategories = TryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    let categories;
    if (myCache.has("categories"))
      categories = JSON.parse(myCache.get("categories") as string);
    else {
      categories = await Product.distinct("category");
      myCache.set("categories", JSON.stringify(categories));
    }
    return res.status(200).json({ success: true, categories });
  }
);

export const getAdminProducts = TryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    let products;
    if (myCache.has("all-products"))
      products = JSON.parse(myCache.get("all-products") as string);
    else {
      products = await Product.find({});
      myCache.set("all-products", JSON.stringify(products));
    }
    return res.status(200).json({ success: true, products });
  }
);

export const getSingleProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  let product;
  if (myCache.has(`product-${id}`)) {
    product = JSON.parse(myCache.get(`product-${id}`) as string);
  } else {
    product = await Product.findById(id);
    if (!product) return next(new ErrorHandler("Product not found", 400));
    myCache.set(`product-${id}`, JSON.stringify(product));
  }
  return res.status(200).json({ success: true, product });
});

export const newProduct = TryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo) return next(new ErrorHandler("Please Add Photo", 400));

    if (!name || !price || !category || !stock) {
      rm(photo.path, () => {
        console.log("Deleted");
      });
      return next(new ErrorHandler("Please enter all fields", 400));
    }

    await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo.path,
    });
    await invalidateCache({ product: true });
    return res
      .status(201)
      .json({ success: true, message: "Product created successfully" });
  }
);

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category } = req.body;
  const photo = req.file;
  const product = await Product.findById(id);
  if (!product) return next(new ErrorHandler("Invalid Product Id", 400));
  if (photo) {
    rm(product.photo!, () => {
      console.log("Old Pic Deleted");
    });
    product.photo = photo.path;
  }
  if (name) product.name = name;
  if (price) product.price = price;
  if (category) product.category = category;
  if (stock) product.stock = stock;
  await product.save();
  await invalidateCache({ product: true });
  return res
    .status(201)
    .json({ success: true, message: "Product updated successfully" });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) return next(new ErrorHandler("Invalid Product Id", 400));
  await Product.findByIdAndDelete(id);
  await invalidateCache({ product: true });
  rm(product.photo!, () => {
    console.log("Pic deleted ");
  });
  return res
    .status(200)
    .json({ success: true, message: "Product deleted successfully" });
});

export const searchAllProducts = TryCatch(
  async (
    req: Request<{}, {}, {}, SearchRequestQuery>,
    res: Response,
    next: NextFunction
  ) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE);
    const skip = limit * (page - 1);
    const baseQuery: BaseQuery = {};
    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };
    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };
    if (category) baseQuery.category = category;
    const productsPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);
    const filteredProductsPromise = Product.find(baseQuery);
    const [products, filteredProducts] = await Promise.all([
      productsPromise,
      filteredProductsPromise,
    ]);
    const totalPage = Math.ceil(filteredProducts.length / limit);
    return res.status(200).json({ success: true, products, totalPage });
  }
);
