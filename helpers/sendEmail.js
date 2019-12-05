const nodemailer = require ('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: 'scot27@ethereal.email',
        pass: '3AuXaKvxKK6Wv7s5d9'
    }
});

const mailer = (msg) => {
  transporter.sendMail(msg, (err, info) => {
      if (err) return console.log (err);
      console.log('Msg send:', info)
  })
};

module.exports = mailer;

