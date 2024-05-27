const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, resetToken) => {
  try {
    console.log("Preparing to send email...");
    console.log("Reset token:", resetToken);

    const tokenValue = resetToken.split("=")[1];
    const resetPasswordLink = `http://localhost:3000/resetpassword?resetToken=${tokenValue}`;
    console.log("Reset password link:", resetPasswordLink);

   
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

  
    const options = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: `
        <html>
          <body>
            <p>A password reset link has been requested for your account. Please use the following link to reset your password:</p>
            <a href="${resetPasswordLink}">Reset Password</a>
          </body>
        </html>
      `,
    };

    console.log("Sending email...");

    const info = await transporter.sendMail(options);
    console.log("Email sent:", info.response);

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;
