exports.up = function (knex) {
    return knex.schema.createTable("user", function (table) {
        //formato da data yyyy:mm:dd usar o tipo date
        //formato do horario hh:mm:ss usar o tipo time
        //atributos da tabela
        table.increments("user_id").primary();
        table.string("user_name").notNullable();
        table.string("email").notNullable();
        table.string("password").notNullable();
        table.integer("draw_points").defaultTo(100);
        table.string("whatsapp").nullable();
        table.string("img_profile").nullable();
        //confirmate acount
        table.integer("confirmation_token").notNullable();
        table.datetime("confirmation_token_expires").notNullable();
        table.boolean("is_verified").notNullable().defaultTo(false);

        //reset password
        table.integer("reset_password_token").nullable();
        table.datetime("reset_password_token_expires").nullable();

        table.string("push_token").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("user");
};
