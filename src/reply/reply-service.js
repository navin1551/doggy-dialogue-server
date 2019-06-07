const ReplyService = {
  getAllReplies(knex) {
    return knex.select("*").from("replies");
  },

  insertReplies(knex, newReplies) {
    return knex
      .insert(newReplies)
      .into("replies")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex
      .from("replies")
      .select("*")
      .where("id", id)
      .first();
  },

  deleteReplies(knex, id) {
    return knex("replies")
      .where({ id })
      .delete();
  },

  updateReplies(knex, id, newReplyFields) {
    return knex("replies")
      .where({ id })
      .update(newReplyFields);
  }
};

module.exports = ReplyService;
