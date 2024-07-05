import nodemailer from 'nodemailer'
import User from "@/models/userModel"
import bcryptjs from 'bcryptjs'
import { use } from 'react'

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        console.log(process.env.MAILTRAP_ID, process.env.MAILTRAP_PASSWORD)

        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000
            })
        } else if (emailType == "RESET") {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000
            })
        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "a2d2425a191af7",
                pass: "4275d8ce6f855e"
            }
        });

        const mailOptions = {
            from: 'puneetpradhan007@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your Password",
            html: `<p>CLick <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}</p>`
        }


        const mailResponse = await transport.sendMail(mailOptions);


    } catch (error: any) {
        console.log(JSON.stringify(error))
        throw new Error(error.message);
    }
}