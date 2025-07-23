import express from "express";
import Student from "../models/students.js";
import { createStudent, displayStudent } from "../controllers/studentsControllers.js";




const studentRouter = express.Router()

studentRouter.post("/",createStudent)

studentRouter.get("/",displayStudent)


export default studentRouter;