import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
        const recipient = [{email}];

        try {
            const response = await mailtrapClient.send({
                from :sender ,
                to: recipient, 
                subject: "Account Verification",
                html : VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
                category: "Email Verification"


            })

            console.log("Email sent successfully", response);

        } catch (error) {
            console.error("Error sending email", error);
            throw new Error("Error sending email", error);
        }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{email}];

    try {
        await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "d823066d-f4fc-42d4-982a-a116f3a704aa",
            template_variables:{
                "company_info_name": "Auth Company",
            "name": name,
            }
            
        });
        console.log("welcome email sent scuccesfully");
    } catch (error) {
        console.error("Error sending email", error);
        throw new Error("Error sending welcome email", error);
    }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to : recipient,
            subject: "Password Reset",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",
        })
    } catch (error) {
        throw new Error("Error sending password reset email", error);
    }

};

export const sendResetSuccessEmail  = async (email) => {   
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successfull",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset Success",
        });
        console.log("Password reset success email sent successfully");
    } catch (error) {
        console.error("Error sending email", error);
        throw new Error("Error sending password reset email", error);
    }
}

