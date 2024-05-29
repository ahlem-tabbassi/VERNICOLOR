
const nodemailer = require("nodemailer");

const sendEmail = async (email, password) => {
  
  let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, 
    },
    
  });


  let info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your New Password from Vernicolor Group",
    html: `
      <p>Welcome to Vernicolor Group Tunisia,</p>
      <p>We have generated a new password for your account with Vernicolor Group.</p>
      <p><strong>Your new password is: ${password}</strong></p>
      <p>Please use this password to log in to your account. For security reasons, we recommend that you change your password after logging in.</p>
     
      <p>Thank you for being a valued member of Vernicolor Group.</p>
      <p>Best regards,<br>The Vernicolor Group Team</p>
    `,
  });
  

  console.log("Message sent: %s", info.messageId);
};

module.exports = { sendEmail };
