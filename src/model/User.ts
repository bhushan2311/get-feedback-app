import mongoose, {Document, Schema} from "mongoose";

export interface Message extends Document{
    content:string,
    createdAT:Date
}

const messageSchema: Schema<Message> = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    createdAT:{
        type:Date,
        required:true
    },
})

export interface User extends Document{
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isVerified: boolean,
    isAcceptingMessage:boolean,
    messages:Message[]
}

const userSchema: Schema<User> = new mongoose.Schema({
    username:{
        type:String,
        required:[true, "Username is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true, "Email  is required"],
        unique:true,
        match:[/.+\@.+\..+/,"Please use valid email address"]
    },
    password:{
        type:String,
        required:[true, "Username is required"],
    },
    verifyCode:{
        required:[true,"Verify code is required"]
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Verify code is required"]
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    messages:[messageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model('User', userSchema);

export default UserModel;