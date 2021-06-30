exports.up = function(knex) {
    return knex.select()
      .from('meetings')
      .then((meetings) => {
        const weekdays = meetings.map((meeting) => {
          return { meetingId: meeting.internal_meeting_id, weekday: (new Date(meeting.start)).getDay() };
        });
        return knex.transaction((trx) => {
          return knex.schema.alterTable('meetings', (table) => table.integer('weekday').unsigned())
            .then(() => {
              return Promise.all(
                weekdays.map((row) => {
                  return knex('meetings')
                    .update({ weekday: row.weekday })
                    .where('internal_meeting_id', row.meetingId)
                    .transacting(trx);
                })
            );
        })
        .then(trx.commit)
        .catch(trx.rollback);
      });
    });
};
  
exports.down = function(knex) {
    return knex.schema.table('meetings', (table) => table.dropColumn('weekday'));
};
