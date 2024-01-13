const nodemailer = require("nodemailer");
const RequestError = require("./requestError");

require('dotenv').config();



const transporter = nodemailer.createTransport(
    {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
      }
    }
  );

  const sendEmail = async (data) => {
    try {
      const emailOptions = {
        ...data,
        from: process.env.EMAIL_USER 
      };
      await transporter.sendMail(emailOptions);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      throw RequestError(400, "Error SendMail");
    }
  };

module.exports = sendEmail;