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

    // const mailOptions = {
    //     from: process.env.STMP_USER,
    //     to: toEmail,
    //     subject: 'Your OTP Code',
    //     html: `<h2>Your OTP is: <b>${otp}</b></h2><p>Valid for 5 minutes.</p>`,
    // };
    const mailOptions = {
        from: `"YourTube" <${process.env.STMP_USER}>`,
        to: toEmail,
        subject: 'Your OTP Code for Password Reset',
        html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f7; font-family: 'Segoe UI', Arial, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding: 40px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
              
              <!-- Header -->
              <tr>
                <td style="background-color:#000000; padding: 28px 32px; text-align:center;">
                  <h1 style="margin:0; color:#ffffff; font-size:22px; letter-spacing: 0.5px;">YourTube</h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 36px 32px 24px 32px;">
                  <h2 style="margin:0 0 12px 0; color:#111111; font-size:20px;">Reset Your Password</h2>
                  <p style="margin:0 0 24px 0; color:#555555; font-size:15px; line-height:1.6;">
                    We received a request to reset your password. Use the OTP below to proceed. This code is valid for the next <b>5 minutes</b>.
                  </p>

                  <!-- OTP Box -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 8px 0 28px 0;">
                        <div style="display:inline-block; background-color:#f4f4f7; border: 1px dashed #cccccc; border-radius: 10px; padding: 16px 36px;">
                          <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color:#000000;">
                            ${otp}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:0 0 8px 0; color:#888888; font-size:13px; line-height:1.6;">
                    If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.
                  </p>
                  <p style="margin:0; color:#888888; font-size:13px; line-height:1.6;">
                    Never share this OTP with anyone, including YourTube staff.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#fafafa; padding: 20px 32px; text-align:center; border-top: 1px solid #eeeeee;">
                  <p style="margin:0; color:#aaaaaa; font-size:12px;">
                    © ${new Date().getFullYear()} YourTube. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `,
    };

    await transporter.sendMail(mailOptions);
    return otp; // isko DB/cache mein save karo verify karne ke liye
}
