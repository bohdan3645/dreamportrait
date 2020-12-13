const nodemailer = require("nodemailer");

module.exports = {
    sendEmail: (receiver, title, content, onSuccess, onFailure) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dreamportraitstore@gmail.com',
                pass: '34yiuOH87%$#'
            }
        });

        const mailOption = {
            from: 'dreamportraitstore@gmail.com',
            to: receiver,
            subject: title,
            html: content
        };

        transporter.sendMail(mailOption, (err, data) => {
            if (err) {
                console.log(err);
                onFailure(err);
            } else {
                onSuccess();
            }
        });
    }
};