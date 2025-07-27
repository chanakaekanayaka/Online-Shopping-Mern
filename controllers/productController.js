import Product from "../models/product.js";


export async function createProduct(req,res){
   
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