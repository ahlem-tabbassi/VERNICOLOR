const nodemailer = require('nodemailer');


const sendEmail = async (email) => {
  
  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",

    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      ciphers: 'SSLv3'
    }
  });


  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'reset password',
    text: `link rest password is `
  };


  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return 'Email sent successfully';
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
};

module.exports = { sendEmail };