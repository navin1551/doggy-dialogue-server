const express = require("express");
const PostService = require("./post-service");

const postRouter = express.Router();
const jsonParser = express.json();

const serializedPosts = post => ({
  id: post.id,
  title: post.title,
  content: post.content,
  date_created: post.date_created,
  forum: post.forumid
});

postRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    PostService.getAllPosts(knexInstance)
      .then(posts => {
        res.json(posts.map(serializedPosts));
      })
      .catch(next);
  })

  .post(jsonParser, (req, res, next) => {
    const { id, title, content, date_created, forumid } = req.body;
    const newPost = { id, title, content, date_created, forumid };
    const knexInstance = req.app.get("db");
    PostService.insertPosts(knexInstance, newPost)
      .then(post => {
        res
          .status(201)
          .location(`/posts/${post.id}`)
          .json(post);
      })
      .catch(next);
  });

module.exports = postRouter;
