import { sequelize } from '../config/dataBase';

export function up () {
    // language=PostgreSQL
    return sequelize.query(`
        CREATE TABLE "tmp_users" (
            "id" AUTO_INCREMENT UNIQUE PRIMARY KEY NOT NULL,
            "firstName" VARCHAR(30) NOT NULL,
            "lastName" VARCHAR(30) NOT NULL,
            "email" VARCHAR(100) UNIQUE NOT NULL,
            "password" TEXT NOT NULL,
            "birthday" TIMESTAMP,
            "createdAt" TIMESTAMP NOT NULL,
            "updatedAt" TIMESTAMP NOT NULL,
            "deletedAt" TIMESTAMP
        );
    `);

}

export function down () {
    // language=PostgreSQL
    return sequelize.query(`DROP TABLE tmp_users`);
}
