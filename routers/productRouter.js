import express from "express";
import { createProduct, deleteProduct, getProduct } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/",createProduct)

productRouter.get("/",getProduct)

productRouter.delete("/:productID",deleteProduct)

export default productRouter;
