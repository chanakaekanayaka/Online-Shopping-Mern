import express from "express";
import { createProduct } from "../controllers/productController";

const productRouter = express.Router();

productRouter.get("/",createProduct)

export default productRouter;
