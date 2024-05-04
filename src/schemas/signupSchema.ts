import {z} from 'zod';

export const usernameValidation = z
    .string()
    .min(4,"username must be at least 4 characters long")
    .max(20,"username must be at max 20 characters long")
    .regex(/^[a-zA-Z0-9_]+$/,"username must not contain special character")


export const signupSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:"username must be at least 6 characters long"})
})