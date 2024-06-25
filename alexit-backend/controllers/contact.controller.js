import nodemailer from 'nodemailer';



export const contact = async (req, res, next) => {
    try {
        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "jotanovicaleksa@gmail.com",
                pass: "tvasvzcsohdlnytb"
            }
        });
        const mailDetails = {
            from: req.body.email,
            to: "jotanovicaleksa@gmail.com",
            subject: `${req.body.name} sent us a portfolio!`,
            html: `
            <div>
            <p>${req.body.message}</p>
            <br/><br/>
            <a href="${req.body.portfolio}">${req.body.portfolio}</a>
            </div>
            `,
        };

        mailTransporter.sendMail(mailDetails, async (err) => {
            if (err) {
                console.log('Contact message error: ', err);
            } else {
                console.log('Contact message sent successfully!');
            }
        });
    } catch (error) {
        console.log("Error catched while sending status mail", error);
    }
};