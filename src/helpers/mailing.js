const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "6f5b755d8fd979",
        pass: "616fc793700b95",
    },
});

async function notifyNewAccount(email) {
    const info = await transporter.sendMail({
        from: '"UNEMI Segura" <thesis@unemisegura.com>', // sender address
        to: email, // list of receivers
        subject: "Creación de cuenta ✔", // Subject line
        html: "<div><strong>Cuenta creada</strong> tu código es</div>", // html body
    });
}

export {notifyNewAccount};