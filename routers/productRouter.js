import express from "express";
import { createProduct, deleteProduct, getProduct, updateProduct } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/",createProduct)

productRouter.get("/",getProduct)

productRouter.delete("/:productID",deleteProduct)

productRouter.put("/:productID",updateProduct)

export default productRouter;
