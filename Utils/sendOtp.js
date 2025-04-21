const nodemailer = require('nodemailer');

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .header h2 {
            color: #2c3e50;
          }
          .otp-box {
            font-size: 28px;
            font-weight: bold;
            background-color: #e8f0fe;
            padding: 15px;
            text-align: center;
            letter-spacing: 5px;
            border-radius: 8px;
            color: #1a73e8;
            margin: 20px 0;
          }
          .footer {
            font-size: 12px;
            color: #888;
            margin-top: 30px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Travelo & Tour Email Verification</h2>
          </div>
          <p>Hello,</p>
          <p>Thank you for signing up! Please use the following One-Time Password (OTP) to verify your email address. This code is valid for <strong>5 minutes</strong>.</p>
          <div class="otp-box">${otp}</div>
          <p>If you did not request this, please ignore this email.</p>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Job Portal. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: `"Travlo & Tour" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for Travelo & Tour Verification",
    text: `Your OTP for verification is: ${otp}. It is valid for 5 minutes.`,
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTP;
