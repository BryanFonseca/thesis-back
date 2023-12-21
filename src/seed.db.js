import Password from "./helpers/password.js";
import { User } from "./sequelize/sequelize.js";

async function init() {
    const adminHashedPass = await Password.toHash('admin');
    const guardHashedPass = await Password.toHash('guardia');
    User.bulkCreate([
        {
            firstName: 'Admin',
            lastName: 'Admin',
            email: 'admin@admin.com',
            password: adminHashedPass,
            isEnabled: true,
            type: 'ADMIN'
        },
        {
            firstName: 'Guardia',
            lastName: 'Guardian',
            email: 'guardia@guardia.com',
            password: guardHashedPass,
            isEnabled: true,
            type: 'GUARDIA'
        }
    ])
}

init();