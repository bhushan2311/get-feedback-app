import {z} from 'zod';


export const messageSchema = z.object({
    content:z
            .string()
            .min(10, "Content must be of 10 characters long")
            .max(300, "Content must be at max 300 characters long")
})