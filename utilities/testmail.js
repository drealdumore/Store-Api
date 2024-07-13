import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import validator from "validator";

export const testMail = async (req, res, next) => {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  let message = {
    from: '"Fred Foo 👻" <foo@example.com>',
    to: "samuelisah234@gmail.com",

    subject: "Hello ✔",
    text: "Successfully Register with us.",
    html: "<b>Successfully Register with us.</b>",
  };

  transporter
    .sendMail(message)
    .then((info) => {
      return res.status(201).json({
        msg: "you should receive an email",
        info: info.messageId,
        preview: nodemailer.getTestMessageUrl(info),
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
};

export const mail = async (req, res) => {
  const { userEmail } = req.body;

  if (!userEmail || !validator.isEmail(userEmail)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  let config = {
    service: "gmail",
    auth: {
      user: "sireroyce1@gmail.com",
      pass: "afkorefpbrrnldgm",
    },
  };

  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Mailgen",
      link: "https://mailgen.js/",
    },
  });

  let response = {
    body: {
      name: "Daily Tuition",
      intro: "Your bill has arrived!",
      table: {
        data: [
          {
            item: "Nodemailer Stack Book",
            description: "A Backend application",
            price: "$10.99",
          },
        ],
      },
      outro: "Looking forward to do more business",
    },
  };

  let mail = MailGenerator.generate(response);

  let message = {
    from: "samuelisah234@gmail.com",
    to: userEmail,
    subject: "Place Order",
    html: mail,
  };

  try {
    console.log("about to send");
    await transporter.sendMail(message);
    return res.status(201).json({
      msg: "You should receive an email",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: error.message });
  }
};
