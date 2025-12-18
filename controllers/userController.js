import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import axios from "axios";
import User from "../models/users.js";
configDotenv();
import nodemailer from "nodemailer";
import OTP from "../models/otp.js";

const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:"ekanayakac040@gmail.com",
        pass:process.env.OTPpw,
    },

});





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
                            role : user.role,
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

export function getUser(req,res){
    if(req.user == null){
        res.status(404).json({
            message:"user not found"
        })
    }else{
        res.json(req.user)
    }
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

export async function googleLogin(req,res){
    const googleToken = req.body.token;

    try{
        const response = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${googleToken}`,
                },
            }
        );

        const user = await User.findOne({
            email:response.data.email,
        });

        if(user != null){
            const token = jwt.sign({
                email:user.email,
                firstName:user.firstName,
                lastName:user.lastName,
                role:user.role,
                isBlocked:user.isBlocked,
                isEmailVerified:user.isEmailVerified,
                image:user.image,
            },process.env.JWT_SECRET);

            res.json({
                token:token,
                message:"Login sucessful",
                role:user.role,
            });
        }else{
            const newUser = new User({
                email: response.data.email,
                firstName: response.data.email,
                lastName:response.data.lastName,
                image:response.data.image,
                role:"user",
                isBlocked:false,
                isEmailVerified:true,
                password:"123"

            });

            await newUser.save();

            const token = jwt.sign(
                {
                email:newUser.email,
                firstName:newUser.firstName,
                lastName:newUser.lastName,
                role:newUser.role,
                isBlocked:newUser.isBlocked,
                isEmailVerified:newUser.isEmailVerified,
                image:newUser.image,
                },
                process.env.JWT_SECRET
            );

            res.json({
                token:token,
                message:"User created sucessfully",
                role: newUser.role,
            });
        }
    }catch(error){
        console.error("Error fretching google user info:", error);
        res.json(500).json({
            message:"Failed to authenticatopn with google"
        })
    }
}


export async function sendOTP(req,res){
    const email = req.body.email;
    //generate random number
    const otpCode = Math.floor(100000+ Math.random() * 900000)
    //delete all otps from the email
   try{
        await OTP.deleteMany({email:email})
        const newOTP = new OTP({email:email, otp: otpCode });
        await newOTP.save();

        const message={
            from:"ekanayakac040@gmail.com",
            to:email,
            subject:"Your OTP code",
            text:`Your OTP code is ${otpCode}`
        }
        transporter.sendMail(message, (error,info)=>{
            if(error){
                console.error("Error sending email:",error);
                res.status(500).json({message:"Failed to send OTP"});
            }else{
                console.log("Email sent:", info.response);
                res.json({message:"OTP sent successfully"});
            }
        });


   }catch{
        res.status(500).json({message:"Failed to delete previous OTPs"})
   }

}

export async function resetPassword(req,res) {
    const email=req.body.email;
    const newPassword = req.body.newPassword;
    const otp = req.body.otp;

    try{
        const otpRecord = await OTP.findOne({email:email, otp:otp});
        if(!otpRecord){
            return res.status(404).json({message:"Invalid OTP"})
        }

        const user = await User.findOne({email:email});
        if(!user){
            return res.status(404).json({message:"user not found"});
        }

        const hashedpassword = bcrypt.hashSync(newPassword,10);
        await User.updateOne({email:email},{password:hashedpassword});
        await OTP.deleteMany({email:email});

        res.json({message:"Password reset sucessfully"});


    }catch(err){
        console.log(err)
        res.status(500).json({message:"Failed to reset password"})
    }



    
}