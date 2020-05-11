require('dotenv').config()

const transporter = require('./transporter');



module.exports.notify =  (res, user, questionLink, question) => {
    const htmlBody = `<h1><strong>Contact Form</strong></h1>
    <p>Hi, ${question.user.fullName}</p>
    <p>Your question has just been answered.</p>
    <div>
    <h3>DETAILS</h3><br/>
    <p><b>Question</b>${question.query}</p>
    <a href=${questionLink}>questionlink</a>
    </diiv>`

    const mailOptions = {
        from: process.env.email,
        // chnage to user.email
        to: question.user.email,
        subject: 'Your Question On Staclone Has An Answer', 
        html: htmlBody,
    };

    transporter.sendMail(mailOptions)
    .then(function (email) {
        res.status(200).json({ success: true, msg: 'Mail sent' });
    }).catch(function (error) {
        res.status(200).json({ success: false, msg: error });
    });
};