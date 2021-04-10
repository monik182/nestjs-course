import {MigrationInterface, QueryRunner} from "typeorm";

export class CoffeeRefactor1618012421558 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
          `ALTER TABLE "coffees" RENAME COLUMN "title" TO "name"`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
          `ALTER TABLE "coffees" RENAME COLUMN "name" TO "title"`,
        );
    }

}
