import express from "express";
import { addCource, displayCource } from "../controllers/courceController.js";

const courseRouters = express.Router()

courseRouters.post("/",addCource)

courseRouters.get("/",displayCource)

export default courseRouters;