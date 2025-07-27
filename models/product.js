import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productID : {
        type : String,
        required : true,
        unique : true
    },
    productName : {
        type : String,
        required : true
    },
    altNames : {
        type : [String],
        default : []
    },
    labelledPrice : {
        type : Number,
        required : true,
    },
    price : {
        type : Number,
        required : true
    },
    image : {
        type : [String],
        default : ["/default-product.jpg"]
    },
    description : {
        type : String,
        required : true
    },
    stock : {
        type : Number,
        required : true,
        default : 0
    },
    isAvilable : {
        type : Boolean,
        default : true
    },
    category : {
        type : String,
        required : true,
        default : "cosmatic"
    }


})

const Product = mongoose.model("products",productSchema)

export default Product;