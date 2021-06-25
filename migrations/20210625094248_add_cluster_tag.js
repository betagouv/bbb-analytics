
exports.up = function (knex) {
    return knex.schema
      .alterTable('meetings', (table) => {
        table.string('tags').nullable();
    });
};

exports.down = async function (knex) {
    await knex.schema
    .alterTable('meetings', (table) => {
        table.dropColumn('tags');
    });
};
  
