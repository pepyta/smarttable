import config from "../config";

const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    config.google.id,
    config.google.email,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: config.google.email.refreshToken
});

export async function sendMail(address: string, subject: string, content: string){
    const accessToken = await oauth2Client.getAccessToken()

    const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: config.google.email.address,
            clientId: config.google.id,
            clientSecret: config.google.secret,
            refreshToken: config.google.email.refreshToken,
            accessToken: accessToken
        }
    });

    const mailOptions = {
        from: `SmartTable <${config.google.email.address}>`,
        to: address,
        subject: subject,
        generateTextFromHTML: true,
        html: content
    };

    smtpTransport.sendMail(mailOptions, (error, response) => {
        if(error) throw error;
        smtpTransport.close();
        return response;
    });
}