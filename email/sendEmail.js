import { Resend } from "resend";
import { RESEND_EMAIL_SECRET } from "../config.js";

const resend = new Resend(RESEND_EMAIL_SECRET);

export const sendEmail = async (email, subject, message) => {
    const { data, error } = await resend.emails.send({
        from: "Zegle <support@notify.zegle.in>",
        to: [email],
        subject: subject,
        html: message,
    });

    if (error) {
        return console.error({ error });
    }

    return true;
};
