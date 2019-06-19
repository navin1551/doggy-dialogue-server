const PostService = {
  getAllPosts(knex) {
    //return knex.select("*").from("posts");
    return knex
      .select("*")
      .from("posts")
      .join("users", { "users.id": "posts.userid" });
  },

  getById(knex, id) {
    return knex
      .from("posts")
      .select("*")
      .where("id", id)
      .first();
  },

  insertPosts(knex, newPosts) {
    return knex
      .insert(newPosts)
      .into("posts")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },

  deletePosts(knex, id) {
    return knex("posts")
      .where({ id })
      .delete();
  },

  updatePosts(knex, id, newPostFields) {
    return knex("posts")
      .where({ id })
      .update(newPostFields);
  }
};

module.exports = PostService;
