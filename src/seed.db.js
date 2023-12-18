import Password from "./helpers/password.js";
import { User } from "./sequelize/sequelize.js";

async function init() {
    const hashedPass = await Password.toHash('admin');
    User.bulkCreate([
        {
            firstName: 'Admin',
            lastName: 'Admin',
            email: 'admin@admin.com',
            password: hashedPass,
            isEnabled: true,
            type: 'ADMIN'
        }
    ])
}

init();