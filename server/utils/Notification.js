const nodemailer = require("nodemailer");


const emailQueue = [];
let isSendingEmail = false;


const sendEmailFromQueue = async () => {
 
  if (!isSendingEmail && emailQueue.length > 0) {
    isSendingEmail = true;
    const { recipientEmails, subject, message } = emailQueue.shift();
    try {
     
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

 
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmails.join(', '), 
        subject: subject,
        text: message,
      };

     
      const info = await transporter.sendMail(mailOptions);
      console.log("Notification email sent:", info.response);
    } catch (error) {
      console.error("Error sending notification email:", error);
     
    } finally {
      isSendingEmail = false;
    
      await sendEmailFromQueue();
    }
  }
};


const addToEmailQueue = (recipientEmails, subject, message) => {
  emailQueue.push({ recipientEmails, subject, message }); 
  sendEmailFromQueue(); 
};


const sendNotification = async (recipientEmails, subject, message) => {

  if (Array.isArray(recipientEmails)) {
    addToEmailQueue(recipientEmails, subject, message);
  } else {
    addToEmailQueue([recipientEmails], subject, message);
  }
};

module.exports = sendNotification;
