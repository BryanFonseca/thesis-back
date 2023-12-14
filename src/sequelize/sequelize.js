import { Sequelize } from "sequelize";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { DataTypes } from "sequelize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sequelize = new Sequelize("thesis", "user", "pass", {
    host: "mysql",
    dialect: "mysql",
    models: [__dirname + "/models"],
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
    }
);


sequelize.sync({ force: true });

// console.log(sequelize.models);
// sequelize.addModels([User]);

export default sequelize;
export {User};