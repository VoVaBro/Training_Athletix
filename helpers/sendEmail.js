const nodemailer = require ('nodemailer');
const user = process.env.EMAIL_ADRESS;
const pass = process.env.EMAIL_PASS;


const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: 'megane27@ethereal.email',
        pass: 'wksT45ZQ5DARsa2AKh'
    }
});

const mailer = (msg) => {
  transporter.sendMail(msg, (err, info) => {
      if (err) return console.log (err);
      console.log('Msg send:', info)
  })
};

module.exports = mailer;

