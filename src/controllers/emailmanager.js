import nodemailer from 'nodemailer';

export class EmailManager{
    constructor(){
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: "coderhouse50015@gmail.com",
                pass: "norp renb afxw uxyq"
            }
        });
    }
    async sendPurchaseEmail(email, first_name, ticket) {
        try {
            const mailOptions = {
                from: "Coder Test <coderhouse50015@gmail.com>",
                to: email,
                subject: 'Confirmación de compra',
                html: `
                    <h1>Confirmación de compra</h1>
                    <p>Gracias por tu compra, ${first_name}!</p>
                    <p>El número de tu orden es: ${ticket}</p>
                `
            };

            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
        }
    }

    async sendRestorationEmail(email, first_name, token){
        try {
            const mailOptions = {
                from: 'coderhouse50015@gmail.com',
                to: email,
                subject: 'Restablecimiento de Contraseña',
                html: `
                    <h1>Restablecimiento de Contraseña</h1>
                    <p>Hola ${first_name},</p>
                    <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código para cambiar tu contraseña:</p>
                    <p><strong>${token}</strong></p>
                    <p>Este código expirará en 1 hora.</p>
                    <a href="http://localhost:8080/password">Restablecer Contraseña</a>
                    <p>Si no solicitaste este restablecimiento, ignora este correo.</p>
                `
            };

            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error al enviar correo electrónico:", error);
            throw new Error("Error al enviar correo electrónico");
        }
    }
    async sendDeletionEmail(email, firstName) {
        const mailOptions = {
            from: 'coderhouse50015@gmail.com',
            to: email,
            subject: 'Cuenta eliminada por inactividad',
            text: `Hola ${firstName},\n\nTu cuenta ha sido eliminada debido a inactividad. Si crees que esto es un error, por favor contacta con soporte.\n\nSaludos,\nEquipo de Soporte`
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Correo enviado a ${email}`);
        } catch (error) {
            console.error(`Error al enviar correo a ${email}: `, error);
        }
    }

    async sendDeletionProductEmail(email, first_name){
        const mailOptions = {
            from: 'coderhouse50015@gmail.com',
            to: email,
            subject: 'Producto eliminado',
            text: `Hola ${first_name},\n\nTu producto ha sido eliminado. Si crees que esto es un error, por favor contacta con soporte.\n\nSaludos,\nEquipo de Soporte`
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Correo enviado a ${email}`);
        } catch (error) {
            console.error(`Error al enviar correo a ${email}: `, error);
        }
    }
}