import {resend} from '@/lib/resend';

import VerificationEmail from '../../emails/VerificationEmail';

import { ApiResponse } from '@/types/ApiResponse';

export const sendVerificationEmail = async (
    username:string,
    email:string,
    verifyCode:string
): Promise<ApiResponse> =>{
    try {

        await resend.emails.send({
            from: '<onboarding@resend.dev>',
            to: email,
            subject: 'True Feedback | Verification Code',
            react: VerificationEmail({username, otp:verifyCode}),
          });
        return {success:true, message:"verification email sent successfully"}
    } catch (emailError) {
        console.log("Error while sending Verification Email: ", emailError);
        return {success: false, message:"Failed to send verification email"}
    }
}