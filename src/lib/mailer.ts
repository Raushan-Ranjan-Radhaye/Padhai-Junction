 import * as nodemailer from 'nodemailer'

 const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth: {
      user: process.env.GMAIL_USER ,
      pass: process.env.GMAIL_APP_PASSWORD
    },
 });


 export async function sendDeliveryOtpEmail(
    email:string,
    otp:string
 ){
    await transporter.sendMail({
        from: `"Order Delivery By MultiCart" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "MultiCart Delivery OTP",
        html:`<div style='font-family:Arial, sans-serif' >
        <h2 >Delivery Verification</h2>
        <p> Your Delivery OTP is: <b>${otp}</b></p>
        <p>This OTP is valid for 10 minutes only</p>
        </div>` 
    })
 }


