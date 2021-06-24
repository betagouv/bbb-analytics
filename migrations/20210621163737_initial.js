exports.up = function (knex) {
    return knex.schema
      .createTable('meetings', (table) => {
        table.text('internal_meeting_id').primary();
        table.text('meeting_name').notNullable();
        table.text('meeting_id').notNullable();
        table.datetime('start');
        table.datetime('finish');
        table.integer('duration');
        table.integer('attendee_count').unsigned();
        table.integer('moderator_count').unsigned();
        table.json('raw_data');
        table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
      });
};

exports.down = function (knex) {
    return knex.schema
        .dropTable('meetings');
};
