const nodemailer = require ('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: 'hattie.wolf67@ethereal.email',
        pass: 'gvG7Uh7xC6PgYUBJQp'
    }
});

const mailer = (msg) => {
  transporter.sendMail(msg, (err, info) => {
      if (err) return console.log (err);
      console.log('Msg send:', info)
  })
};

module.exports = mailer;
