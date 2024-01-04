import Password from "./helpers/password.js";
import { Guard, Incidence, Student, User } from "./sequelize/sequelize.js";

async function init() {
    // Guard seed
    const guardUser = await User.create(
        {
            firstName: 'Carlos',
            lastName: 'López',
            email: 'clopez@gmail.com',
            password: 'clopez',
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
            firstName: 'Isaac',
            lastName: 'Toala',
            email: 'itoala@gmail.com',
            password: 'itoala',
            isEnabled: true,
        }
    );
    const student = await Student.create({
        semester: 0
    });
    await student.setUser(studentUser);

    // Incidence Seed
    await Incidence.create({
        StudentId: student.id,
        GuardId: guard.id,
        state: 'RESUELTA',
    });
    await Incidence.create({
        StudentId: student.id,
        GuardId: guard.id,
        state: 'RESUELTA',
    });
    await Incidence.create({
        StudentId: student.id,
        GuardId: guard.id,
        state: 'PENDIENTE',
    });

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