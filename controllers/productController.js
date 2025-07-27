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

export async function deleteProduct(req,res){
    
    if(!isAdmin(req)){
        res.status(401).json(
            {
                message : "Un othorized user.please login as admin"
            }
        )
        return
    }

    try{
        const ProductID = req.params.productID;

        await Product.deleteOne(
            {
                productID : ProductID
            }
        )

        res.json(
            {
                message : "Product deleted sucessfully"
            }
        )

    }catch(error){
        res.error("Product was not found ",error)
        res.status(500).json(
            {
                message : "Failed to delete product"
            }
        )
        return


    }

}


export async function updateProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json({
            message : "Please login as admin"
        })
         return
    }

    const data = req.body
    const productID = req.params.productID
    data.ProductID = productID

    try{

        await Product.updateOne(
            {
                productID : productID
            },data
        )

        res.json({
            message : "Product update sucessfully"
        })

    }catch(error){
        console.error("Product update failed",eror)
        res.status(500).json(
            {
                message : "Product update unsucessful"
            }
        )
        return 

    }
   
}