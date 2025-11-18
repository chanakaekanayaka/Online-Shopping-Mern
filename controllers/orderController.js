import order from "../models/order.js";
import User from "../models/users.js";

export async function createOrder(req,res){

    if(req.user == null){
        res.status(401).json({message : "please login to create a order"})
        return;
    }

    const latestOrder = await order.find().sort({date : -1}).limit(1)

     let orderID = "CBC00202"

     if(latestOrder.length > 0){
        //if order exists CBC00635
        const latestOrderIdinString = latestOrder[0].orderID; //CBC00635
        const latestOrderIdWithoutprefix = latestOrderIdinString.replace("CBC","")//00635
        const latestOrderIdInInteger = parseInt(latestOrderIdWithoutprefix)//635
        const newOrderIdInInteger = latestOrderIdInInteger +1 //636
        const newOrderIdWithoutPrefix = newOrderIdInInteger.toString().padStart(5, '0'); //00636
        orderID = "CBC"+newOrderIdWithoutPrefix; //CBC00636

     }

     const order = new order(
        {
            orderID : orderID,
            email : req.body.email,
            name : req.body.name,
            address : req.body.address,
            phone : req.body.phone,
            items : [],
        }
     )

     const result = await order.save();

     res.json(
        {
            message : "Order created sucessfully",
            result : result
        }
     );







}