import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import Student from "./models/students.js";
import studentRouter from "./routers/studentsRouter.js";
import courseRouter from "./routers/courseRouters.js";
import userRouter from "./routers/userRouter.js";
import jwt, { decode } from "jsonwebtoken";
import productRouter from "./routers/productRouter.js";
import dotenv from "dotenv";
import cors from "cors";
import orderRouter from "./routers/orderRouter.js";

dotenv.config();


const app=express()

app.listen(5000,
    ()=>{
        console.log("server started")
    }
)

app.use(bodyParser.json())
app.use(cors())
app.use(
    (req,res,next)=>{
        console.log("Request Reserved")

        const value = req.header("Authorization")
        if(value != null){
            const token = value.replace("Bearer ","")

            jwt.verify(token,
                process.env.JWT_SECRET,
                (err,decode)=>{
                    
                    if(decode == null){
                        res.status(403).json({
                            message : "Unothorized User"
                        })
                        
                            
                        
                    }
                    else{
                        console.log("User found")
                        req.user =decode
                        next()
                    }
                    

    
                }
            )         
        
        }
        
        else{
             next()

        }
       

    }
)
 
const ConnectionString=process.env.MONGO_URL;

mongoose.connect(ConnectionString).then(
    ()=>{
        console.log("Database Connected..")
    }
).catch( 
    ()=>{
        console.log("Faild to connect to the Database")
    }
)



app.use("/api/users",userRouter);

app.use("/api/products",productRouter);

app.use("/api/orders/",orderRouter)





