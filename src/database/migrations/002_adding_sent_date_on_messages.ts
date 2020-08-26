import Knex from "knex";

export async function up(knex: Knex) {
  return knex.schema.alterTable("messages", (table) => {
    table.string("sent");
  });
}

export async function down(knex: Knex) {
  return knex.schema.alterTable("messages", (table) => {
    table.dropColumn("sent");
  });
}
