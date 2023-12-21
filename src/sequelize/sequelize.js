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
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pushSubscription: {
            type: DataTypes.JSON,
            allowNull: true
        }
    },
    {
        // Other model options go here
        hooks: {
            beforeSave: async (user, options) => {
                if (user.changed("password")) {
                    user.password = await Password.toHash(user.password);
                }
            },
        },
    }
);

/*
const PushNotificationSubscriptions = sequelize.define(
    "PushNotificationSubscriptions",
    {
        subscription: {
            type: DataTypes.JSON,
            allowNull: false,
        }
    }
);
*/

await sequelize.sync({ force: true });

// console.log(sequelize.models);
// sequelize.addModels([User]);

export default sequelize;
export { User };
