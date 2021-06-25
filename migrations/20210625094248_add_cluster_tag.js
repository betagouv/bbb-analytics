
exports.up = function (knex) {
    return knex.schema
      .alterTable('meetings', (table) => {
        table.string('cluster_name').nullable();
    });
};

exports.down = async function (knex) {
    await knex.schema
    .alterTable('meetings', (table) => {
        table.dropColumn('cluster_name');
    });
};
  
