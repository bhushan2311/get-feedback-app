import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";

export async function POST(request:Request){
    await dbConnect();
    try {
        const {username, email, password} = await request.json();

        // If user exist with username
        const userExistVerifiedByUsername =  await UserModel.findOne({username, isVerified:true});
        if(userExistVerifiedByUsername){
            return Response.json(
                {
                    success:false,
                    message:"Username is already existed!"
                },
                {
                    status:400
                }
            )
        }

        // If user exist with email
        const userExistByEmail = await UserModel.findOne({email});
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if(userExistByEmail){
            if(userExistByEmail.isVerified){
                return Response.json(
                    {
                        success:false,
                        message:"Email is already existed!"
                    },
                    {
                        status:400
                    }
                );
            }
            else{
                // DOUBT
                const hashedPassword = await bcrypt.hash(password,10);
                userExistByEmail.password = hashedPassword;
                userExistByEmail.verifyCode = verifyCode;
                userExistByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await userExistByEmail.save();
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password,10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);     // setting expiry from current hour to plus 1 hour

            const newUser = new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
            });

            await newUser.save(); 
        }

        // -- send verification email --
        const emailResponse = await sendVerificationEmail(email,username,verifyCode);
        // if fails sending email
        if(!emailResponse.success){
            return Response.json(
                {
                    success:false,
                    message:emailResponse.message
                },
                {
                    status:500
                }
            )
        }
        // email send
        return Response.json(
            {
                success:true,
                message:`User registered successfully, Email has been sent to ${email}`
            },
            {
                status:201
            }
        )

    } catch (error) {
        console.log("Error while registering Email", error);
        return Response.json(
            {
                success:false,
                message:"Error registering User"
            },
            {
                status:500
            }
        )
        
    }
}