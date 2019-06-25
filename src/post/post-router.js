const express = require("express");
const PostService = require("./post-service");
const { requireAuth } = require("../middleware/jwt-auth");

const postRouter = express.Router();
const jsonParser = express.json();

const serializedPosts = post => ({
  id: post.id,
  title: post.title,
  content: post.content,
  date_created: post.date_created,
  forumid: post.forumid
});

postRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    PostService.getAllPosts(knexInstance)
      .then(posts => {
        //res.json(posts.map(serializedPosts));
        res.json(posts);
      })
      .catch(next);
  })

  .post(requireAuth, jsonParser, (req, res, next) => {
    const { id, title, content, date_created, forumid } = req.body;
    const newPost = { id, title, content, date_created, forumid };
    const knexInstance = req.app.get("db");
    newPost.userid = req.user.id;
    PostService.insertPosts(knexInstance, newPost)
      .then(post => {
        res
          .status(201)
          .location(`/api/posts/${post.id}`)
          .json(post);
      })
      .catch(next);
  });

postRouter
  .route("/:id")
  .all((req, res, next) => {
    const { id } = req.params;
    const knexInstance = req.app.get("db");
    PostService.getById(knexInstance, id)
      .then(post => {
        if (!post) {
          return res
            .status(404)
            .send({ error: { message: `Post doesn't exist` } });
        }
        res.post = post;
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(serializedPosts(res.post));
  })

  .delete((req, res, next) => {
    const { id } = req.params;
    const knexInstance = req.app.get("db");
    PostService.deletePosts(knexInstance, id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(jsonParser, (req, res, next) => {
    const { id, title, content, date_created, forumid } = req.body;
    const postToUpdate = { id, title, content, date_created, forumid };
    const knexInstance = req.app.get("db");

    PostService.updatePosts(knexInstance, req.params.id, postToUpdate)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = postRouter;
