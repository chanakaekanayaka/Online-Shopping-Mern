import order from "../models/order.js";
import Product from "../models/product.js";


export async function createOrder(req,res){

    try{

            if(req.user == null){
        res.status(401).json({message : "please login to create a order"})
        return;
    }

    const latestOrder = await order.find().sort({date : -1}).limit(1)

     let orderId = "CBC00202"

     if(latestOrder.length > 0){
        //if order exists CBC00635
        const latestOrderIdinString = latestOrder[0].orderID; //CBC00635
        const latestOrderIdWithoutprefix = latestOrderIdinString.replace("CBC","")//00635
        const latestOrderIdInInteger = parseInt(latestOrderIdWithoutprefix)//635
        const newOrderIdInInteger = latestOrderIdInInteger +1 //636
        const newOrderIdWithoutPrefix = newOrderIdInInteger.toString().padStart(5, '0'); //00636
        orderId = "CBC"+newOrderIdWithoutPrefix; //CBC00636

     }

     const items =[];
     let total = 0;
     if(req.body.items!==null && Array.isArray(req.body.items)){
        
        for(let i=0 ; i<req.body.items.length ; i++){
            let item = req.body.items[i]

            let product = await Product.findOne({ productID: item.productId});

            if(product == null){
               return res.status(400).json({message:"Invalid product "})
                
            }
            items[i]={
                productId: product.productID,
                name:product.productName,
                image: product.image[0],
                price:product.price,
                qty:item.qty
                

            }

            total += product.price *item.qty;

        }
     }



     const Order = new order(
        {
            orderID : orderId, 
            email : req.user.email,
            name : req.user.firstName+ " "+req.user.lastName,
            address : req.body.address,
            phone : req.body.phone,
            items : items,
            total: total,
            
        }
     );

     const result = await Order.save();

     res.json(
        {
            message : "Order created sucessfully",
            result : result
        }
     );

    }catch(error){

        console.error("Error creating order" , error)
        res.status(500).json({message:"Failed to create order"})

    }

}


export async function getOrders(req,res) {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 10;

    if(req.user == null){
        res.json(401).json({message:"Please login to view orders"})
        return;
    }

    try{

        if(req.user.role == "admin"){
            const orderCount = await order.countDocuments();

            const totalpages = Math.ceil(orderCount / limit);

            const orders = await order.find().skip((page-1)*limit).limit(limit).sort({date: -1})
            res.json({
                orders:orders,
                totalpages:totalpages,
            });
        }else{
            const orderCount = await order.countDocuments({email: req.user.email});
            const totalpages = Math.ceil(orderCount / limit);
            const orders = await order.find({email:req.user.email}).skip((page-1)*limit).limit(limit).sort({date:-1});
            res.json({
                orders:orders,
                totalpages: totalpages,
            })
        }

    }catch(error){

        console.error("Error fetching orders:",error)
        res.status(500).json({message:"Faild to fetch orders"})

    }
    
}