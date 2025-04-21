const nodemailer = require('nodemailer');

const getEmailContent = (type, data = {}) => {
  switch (type) {
    case 'welcome':
      return `
        <p>Hello ${data.name || 'User'},</p>
        <p>Welcome to <strong>Travlo & Tour</strong>! We're excited to have you on board.</p>
        <p>Feel free to explore and plan your next adventure with us.</p>
        <a href="${data.link || '#'}" class="button">Get Started</a>
      `;
    case 'otp':
      return `
        <p>Hello,</p>
        <p>Your One-Time Password (OTP) for verification is:</p>
        <div style="font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0;">${data.otp}</div>
        <p>This OTP is valid for 5 minutes.</p>
      `;
    case 'reset-password':
      return `
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to proceed:</p>
        <a href="${data.resetLink}" class="button">Reset Password</a>
        <p>If you did not request a password reset, please ignore this email.</p>
      `;
    case 'custom':
    default:
      return data.customContent || '<p>No content provided.</p>';
  }
};

const sendEmail = async (to, subject, type = 'custom', data = {}) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const content = getEmailContent(type, data);

    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .header h1 {
              color: #2c3e50;
              margin: 0;
            }
            .content {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 20px;
            }
            .footer {
              font-size: 12px;
              color: #999;
              border-top: 1px solid #eee;
              padding-top: 15px;
              text-align: center;
            }
            .button {
              display: inline-block;
              padding: 12px 20px;
              background-color: #007BFF;
              color: #fff !important;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
            @media (max-width: 600px) {
              .container {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Travlo & Tour</h1>
            </div>
            <div class="content">
              ${content}
            </div>
            <div class="footer">
              This is an automated message. Please do not reply.<br>
              © ${new Date().getFullYear()} Travlo & Tour. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Travlo & Tour" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlTemplate,
      text: content.replace(/<[^>]*>/g, ''), // Plain fallback
    });

    console.log(`✅ Email sent to ${to} with subject "${subject}"`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
    throw new Error('Email sending failed');
  }
};

module.exports = sendEmail;
