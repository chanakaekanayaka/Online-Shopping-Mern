import express from "express";
import { createProduct, deleteProduct, getProduct, getProductInfo, searchProduct, updateProduct } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/",createProduct)

productRouter.get("/",getProduct)

productRouter.get("/:productID",getProductInfo)

productRouter.delete("/:productID",deleteProduct)

productRouter.put("/:productID",updateProduct)

productRouter.get("/search/:query", searchProduct)

export default productRouter;
