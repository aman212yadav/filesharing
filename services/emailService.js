const nodemailer = require('nodemailer');
async function sendMail( {from, to ,subject,text,html}){
  let transporter=nodemailer.createTransport({
    service:'gmail',
    auth : {
       user: process.env.MAIL_USER,
       pass:process.env.MAIL_PASS
    }

  });
  let info = transporter.sendMail({
    from,to,subject,text,html
  })
}

module.exports= sendMail;
