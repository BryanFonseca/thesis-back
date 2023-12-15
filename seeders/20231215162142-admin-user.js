"use strict";

/** @type {import('sequelize-cli').Migration} */
export const seed = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "User",
            [
                {
                    firstName,
                    lastName,
                    email,
                    password: signupCode,
                    isEnabled: true,
                    type: "ADMIN",
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('User', null, {});
    },
};
