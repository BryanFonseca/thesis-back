import { Sequelize } from "sequelize";
import { DataTypes } from "sequelize";
import Password from "../helpers/password.js";

const sequelize = new Sequelize("thesis", "user", "pass", {
    host: "mysql",
    dialect: "mysql",
});

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
    },
    {
        // Other model options go here
        hooks: {
            beforeSave: async (user, options) => {
                user.password = await Password.toHash(user.password);
            },
        },
    }
);

sequelize.sync({ force: true });

// console.log(sequelize.models);
// sequelize.addModels([User]);

export default sequelize;
export { User };
