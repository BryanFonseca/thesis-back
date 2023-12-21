import { Sequelize } from "sequelize";
import { DataTypes } from "sequelize";
import Password from "../helpers/password.js";

const sequelize = new Sequelize("thesis", "user", "pass", {
    host: "mysql",
    dialect: "mysql",
});

// TODO: ocultar campo contraseña al recuperar
const User = sequelize.define(
    "User",
    {
        // Model attributes are defined here
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            // allowNull defaults to true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        // Other model options go here
        hooks: {
            beforeSave: async (user, options) => {
                if (user.changed("password")) {
                    // console.log('Changed for', user.password);
                    user.password = await Password.toHash(user.password);
                }
            },
        },
    }
);

const Student = sequelize.define(
    "Student",
    {
        semester: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        // More student fields
    },
);

const Guard = sequelize.define(
    "Guard",
    {
        pushSubscription: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        // More guard fields. Empresa, blah blah
    },
);

User.hasOne(Student);
Student.belongsTo(User);

User.hasOne(Guard);
Guard.belongsTo(User);

/*
const Incidence = sequelize.define(
    "Incidence",
    {
        StudentId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id'
            }
        },
        GuardId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id'
            }
        },
        lat: {
            type: DataTypes.NUMBER,
        },
        lng: {
            type: DataTypes.NUMBER,
        }
    },
);

// Associations
User.belongsToMany(User, {as: 'Users', through: Incidence});
*/

// TODO: Crear entidad incidencia con campos Estudiante, Guardia y ubicación
// TODO: 

await sequelize.sync({ force: true });

// console.log(sequelize.models);
// sequelize.addModels([User]);

export default sequelize;
export { User, Student, Guard };
