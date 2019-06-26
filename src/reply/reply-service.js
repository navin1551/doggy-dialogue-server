const ReplyService = {
  getAllReplies(knex) {
    //return knex.select("*").from("replies");
    return knex
      .select(
        "replies.id",
        "replies.reply",
        "replies.date_commented",
        "users.user_name",
        "replies.postid"
      )
      .from("replies")
      .join("users", { "users.id": "replies.userid" })
      .orderBy("replies.id");
  },

  insertReplies(knex, newReplies) {
    return knex
      .insert(newReplies)
      .into("replies")
      .returning("*")
      .then(rows => {
        return rows[0];
      })
      .then(reply => {
        return knex
          .select("user_name")
          .from("users")
          .where("id", reply.userid)
          .then(username => {
            reply.username = username;
            return reply;
          });
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
