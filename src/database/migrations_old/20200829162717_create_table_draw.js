exports.up = function (knex) {
    return knex.schema.createTable("draw", function (table) {
        table.increments("cod_draw").primary();
        table.integer("user_id");

        table.integer("num_participants");
        table.datetime("draw_date").notNullable();

        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("draw");
};
