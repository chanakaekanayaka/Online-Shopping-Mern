import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName : {
            type : String,
            required : true,
        },

        lastName : {
            type : String,
            required : true,

        },

        email : {
            type : String,
            required : true,
            unique : true,
        },
        password : {
            type : String,
            required : true,
        },
        phoneNo : {
            type : String,
            default : "NOT-GIVEN",
        },
        isBlocked : {
            type : Boolean,
            default : false,
        },
        role : {
            type : String,
            default : "user",
        },
        isEmailVerified : {
            type : Boolean,
            default : false,
        },
        image : {
            type : String,
            default : "https://pixabay.com/vectors/user-little-man-icon-social-media-3331256/"
        }

    }


)

const User =mongoose.model("users",userSchema)

export default User;