import Mailgun from "mailgun-js";

const mailGunClient = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY || "",
    domain: "sandbox25203f047caa4d91b5850c8bebc101a6.mailgun.org"
});

const sendEmail = (subject: string, html: string) => {
    const emailData = {
        from: "dongkyu@qmit.kr",
        to: "dongkyu@qmit.kr",
        subject,
        html
    };
    return mailGunClient.messages().send(emailData);
};

export const sendVerificationEmail = (fullname: string, key: string) => {
    const emailSubject = `Hello ${fullname}, please verify your email`;
    const emailBody = `Verify your email by clicking <a href="http://nuber.com/verification/${key}/">Here</a>`;
    return sendEmail(emailSubject, emailBody);
};