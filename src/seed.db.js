import Password from "./helpers/password.js";
import { Guard, User } from "./sequelize/sequelize.js";

async function init() {
    const guardHashedPass = await Password.toHash('guardia');
    const guardUser = await User.create(
        {
            firstName: 'Guardia',
            lastName: 'Guardian',
            email: 'guardia@guardia.com',
            password: 'guardia',
            isEnabled: true,
        }
    );
    const guard = await Guard.create({
        pushSubscription: null
    });
    await guard.setUser(guardUser);

    /*
    console.log('GUARD IS', guard);
    const relatedUser = await guard.getUser();
    console.log('User related is', relatedUser);
    console.log('Back to guard', await relatedUser.getGuard())
    */

    // Created admin
    const adminHashedPass = await Password.toHash('admin');
    User.bulkCreate([
        {
            firstName: 'Admin',
            lastName: 'Admin',
            email: 'admin@admin.com',
            password: adminHashedPass,
            isEnabled: true,
        },
    ])
}

init();