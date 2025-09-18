const nodemailer = require('nodemailer');

// Configure email transporter (using Gmail as example)
const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com.au",
    port: 993,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// For development, we'll simulate email sending
const sendVerificationEmail = async (email, verificationCode, contestantName) => {
    try {
        if (process.env.NODE_ENV === 'development') {
            console.log(`📧 Verification email for ${email}:`);
            console.log(`Verification Code: ${verificationCode}`);
            console.log(`Voting for: ${contestantName}`);
            return { success: true, messageId: 'dev-mode' };
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Voting Verification Code',
            html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333; text-align: center;">Voting Verification</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>Hello,</p>
            <p>You are voting for: <strong>${contestantName}</strong></p>
            <p>Your verification code is:</p>
            <div style="background: #007bff; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 4px; letter-spacing: 2px;">
              ${verificationCode}
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              This code will expire in 1 hour. If you did not request this verification, please ignore this email.
            </p>
          </div>
        </div>
      `
        };

        const result = await transporter.sendMail(mailOptions);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Email sending error:', error);
        throw new Error('Failed to send verification email');
    }
};

module.exports = { sendVerificationEmail };