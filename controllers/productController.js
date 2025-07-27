import Product from "../models/product.js";
import { isAdmin } from "./userController.js";


export async function createProduct(req,res){

    if(req.user == null){

        res.status(403).json(
            {
                message : "Please login to create a product"
            }
        )
        return;

    }

    if(req.user.role != "admin"){

        res.status(401).json(
            {
                message : "You are not authroized to create a product"
            }
        )
        return ;
    }
   
    const product = new Product(req.body)

    try {

        const response = await product.save()

        res.json(
            {
                message : "Product created sucessfully",
                product : product
            }
        )
        

    }catch(error){

        console.error("Product created unsucessfully" ,error)
        res.status(500).json(
            {
                message : "Product created failed"
            }
        )
        
        return ;


    }

}

export async function getProduct(req,res){

    try{

        

        if(isAdmin(req)){
            const products =await Product.find();
            return res.json(products)
            

        }

        if(!isAdmin(req)){
            const products = await Product.find({isAvilable : true});
            res.json(products)
        }
       
       
    

    }catch(error){
        console.error("Error fetching products",error)
        res.status(400).json(
            {
                message : "Faild to fetch products"
            }
        )

    }
    


}