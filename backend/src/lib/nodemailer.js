import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.STMP_USER,
        pass: process.env.STMP_PASSWORD,
    },
})

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
}

export const sendOTP = async (toEmail) => {
    const otp = generateOTP();

    const mailOptions = {
        from: process.env.STMP_USER,
        to: toEmail,
        subject: 'Your OTP Code',
        html: `<h2>Your OTP is: <b>${otp}</b></h2><p>Valid for 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    return otp; // isko DB/cache mein save karo verify karne ke liye
}
