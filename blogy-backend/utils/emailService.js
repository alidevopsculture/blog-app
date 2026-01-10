const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTP = async (email, otp) => {
  try {
    console.log('Sending email to:', email);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Blogy - Email Verification OTP',
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP for Blogy registration is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 5 minutes.</p>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

module.exports = { sendOTP };