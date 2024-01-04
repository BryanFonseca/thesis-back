import { Sequelize } from "sequelize";
import { DataTypes } from "sequelize";
import Password from "../helpers/password.js";
import sequelizeErd from "sequelize-erd";
import fs from "fs";

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
            defaultValue: false,
        },
        currentPosition: {
            type: DataTypes.JSON,
            defaultValue: {
                latitude: 0,
                longitude: 0,
            },
        },
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

const Student = sequelize.define("Student", {
    semester: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // More student fields
});

const Guard = sequelize.define("Guard", {
    pushSubscription: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    // More guard fields. Empresa, blah blah
});

User.hasOne(Student);
Student.belongsTo(User);

User.hasOne(Guard);
Guard.belongsTo(User);

// Los estados pueden ser 'PENDIENTE' y 'RESUELTA'
const Incidence = sequelize.define("Incidence", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    // StudentId: {
    //     type: DataTypes.INTEGER,
    //     references: {
    //         model: Student,
    //         key: "id",
    //     },
    // },
    // GuardId: {
    //     type: DataTypes.INTEGER,
    //     references: {
    //         model: Guard,
    //         key: "id",
    //     },
    // },
    latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: -2.1504796752389517,
    },
    longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: -79.6030960718069,
    },
    state: {
        type: DataTypes.STRING,
        defaultValue: "PENDIENTE",
    },
});

// Super Many-to-Many relationship
Student.belongsToMany(Guard, { through: { model: Incidence, unique: false } });
Guard.belongsToMany(Student, { through: { model: Incidence, unique: false } });
Student.hasMany(Incidence);
Incidence.belongsTo(Student);
Guard.hasMany(Incidence);
Incidence.belongsTo(Guard);

await sequelize.sync({ force: true });

// Creates ER diagram
const svg = await sequelizeErd({ source: sequelize });
fs.writeFileSync("./erd.svg", svg);

export default sequelize;
export { User, Student, Guard, Incidence };

// TODO: Refactor this splitting models across multiple files
// TODO: Abstract away Student and Guard creation
