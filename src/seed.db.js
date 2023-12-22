import Password from "./helpers/password.js";
import { Guard, Student, User } from "./sequelize/sequelize.js";

async function init() {
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

    // Student seed
    const studentUser = await User.create(
        {
            firstName: 'Estudiante',
            lastName: 'Estudion',
            email: 'estudiante@estudiante.com',
            password: 'estudiante',
            isEnabled: true,
        }
    );
    const student = await Student.create({
        semester: 0
    });
    await student.setUser(studentUser);

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