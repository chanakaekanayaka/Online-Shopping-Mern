import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv;

export function createUser(req,res){

    const passwordHash = bcrypt.hashSync(req.body.password,10)

    const userData = {
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        password : passwordHash,
    }

    const user = new User(userData)

    user.save().then(
        ()=>{
            res.json(
                {
                    message : "User created Sucessfully"
                }
            )
        }
    ).catch(
        ()=>{
            res.json(
                {
                    message : "User created UnSucessfully"
                }
            )
        }
    )
}


export function loginUser(req,res){
    const email = req.body.email 
    const password = req.body.password
    
    User.findOne({
        email : email
    }).then(
      
        (user)=>{
            if( user == null){
                res.status(404).json(
                    {
                        message : 'user not found'
                    }
                )
            }else{
                  
                const isPasswordCorrect = bcrypt.compareSync(password, user.password)
                if(isPasswordCorrect ){

                    const token = jwt.sign(
                        {
                            email : user.email,
                            firstName : user.firstName,
                            lastName : user.lastName,
                            role : user.role,
                            isBlocked : user.isBlocked,
                            isEmailVerified : user.isEmailVerified,
                            Image : user.image
                        },
                        process.env.JWT_SECRET 
                    )

                res.json(
                        {
                            token : token,
                            message : "Login sucessfull"
                        }
                    )
                }else{
                    res.status(403).json(
                        {
                            message : "Incorrect Password"
                        }
                    )
                }
            }
          
              
        }   
       
    )

}

export function isAdmin(req){

    if(req.user == null){
        return false;
    }
    if(req.user.role == "admin"){

        return true;
    }
    else{
        return false;
    }


}