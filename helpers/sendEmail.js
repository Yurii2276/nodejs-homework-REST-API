const nodemailer = require('nodemailer');
const RequestError = require("./requestError");

require('dotenv').config();

console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);

const config = {
 host: 'smtp.meta.ua',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        // rejectUnauthorized: true,
		// minVersion: "TLSv1.2",
      },
    tls: {rejectUnauthorized: false},
    };

const transporter = nodemailer.createTransport(config);

  const sendEmail = async (data) => {
    try {
      const emailOptions = {
        ...data,
        from: process.env.EMAIL_USER,
      };
      await transporter.sendMail(emailOptions);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      throw RequestError(400, "Error SendMail");
    }
  };

module.exports = sendEmail;