import nodemailer from "nodemailer";
import validator from "validator";
import pug from "pug";
import { fileURLToPath } from "url";
import { dirname } from "path";

export class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `saint <${process.env.EMAIL_FROM}>`;
  }

  async newTransport() {
    // Production: Use Gmail
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GOOGLE_USERNAME,
          pass: process.env.GOOGLE_PASSWORD,
        },
      });
    }

    // Development: Use EthereaL
    let testAccount = await nodemailer.createTestAccount();
    console.log(testAccount);
    // return nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  // Send the actual email
  async send(template, subject) {
    // Get the directory name of the current module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };

    // 3) Create a transport and send email
    const transporter = await this.newTransport();
    await transporter.sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the Store API!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
}

export const sendEmail = async (req, res, next) => {
  const { userEmail } = req.body;

  if (!userEmail || !validator.isEmail(userEmail)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const user = { email: userEmail, name: "User" }; 
  const url = "https://example.com"; 
  try {
    const email = new Email(user, url);
    const info = await email.sendWelcome();
    return res.status(201).json({
      msg: "you should receive an email",
      preview: nodemailer.getTestMessageUrl(info),
    });
    
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: error.message });
  }
};
