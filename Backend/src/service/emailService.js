const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_EMAIL_ID, // Your email address
        pass: process.env.GMAIL_APP_PASSWORD  // Your email password or app password
    }
});

const send = async (to, subject, body) => {
    try {
        const emailOptions = {
            to: to, // List of recipients
            subject: subject, // Subject line
            text: body ,// Plain text body
            from: process.env.GMAIL_EMAIL_ID, // Sender address
        };

        await transporter.sendMail(emailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

module.exports={send};