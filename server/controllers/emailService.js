
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
    debug: true, 
    logger: true
  });


  let info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email, 
    subject: "Your New Password",
    text: `Your new password: ${password}`, 
   
  });

  console.log("Message sent: %s", info.messageId);
};

module.exports = { sendEmail };
