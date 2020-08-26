import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.createTable("messages", (table) => {
    table.increments("id").primary();
    table.string("to").notNullable();
    table.decimal("message").notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable("messages");
}
