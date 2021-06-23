exports.up = function (knex) {
    return knex.schema
      .createTable('meeting_stats', (table) => {
        table.uuid('id').primary().notNullable().defaultTo(knex.raw('gen_random_uuid()'));
        table.text('meeting_name').notNullable();
        table.text('meeting_id').notNullable();
        table.timestamp('create_time');
        table.datetime('create_date');
        table.text('voice_bridge');
        table.text('dial_number');
        table.text('attendee_pw');
        table.text('moderator_pw');
        table.boolean('running');
        table.integer('duration');
        table.boolean('has_user_joined');
        table.boolean('recording');
        table.text('has_been_forcibly_ended');
        table.timestamp('start_time');
        table.timestamp('end_time');
        table.integer('participant_count').unsigned();
        table.integer('listener_count').unsigned();
        table.integer('voice_participant_count').unsigned();
        table.integer('video_count').unsigned();
        table.integer('max_users').unsigned();
        table.integer('moderator_count').unsigned();
        table.text('version');
        table.text('internal_meeting_id');
        table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
      });
};

exports.down = function (knex) {
    return knex.schema
        .dropTable('meeting_stats');
};