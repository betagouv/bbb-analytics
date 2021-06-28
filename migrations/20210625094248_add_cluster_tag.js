
exports.up = function (knex) {
    return knex.schema
      .alterTable('meetings', (table) => {
        table.text('tag').nullable();

    });
};

exports.down = async function (knex) {
    await knex.schema
    .alterTable('meetings', (table) => {
        table.dropColumn('tag');
    });
};
  
