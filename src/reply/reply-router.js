const express = require("express");
const ReplyService = require("./reply-service");
const { requireAuth } = require("../middleware/basic-auth");

const replyRouter = express.Router();
const jsonParser = express.json();

const serializedReplies = reply => ({
  id: reply.id,
  reply: reply.reply,
  date_commented: reply.date_commented,
  postid: reply.postid,
  userid: reply.userid
});

replyRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    ReplyService.getAllReplies(knexInstance)
      .then(replies => {
        res.json(replies.map(serializedReplies));
      })
      .catch(next);
  })

  .post(jsonParser, (req, res, next) => {
    const { id, reply, date_commented, postid, userid } = req.body;
    const newReply = { id, reply, date_commented, postid, userid };
    const knexInstance = req.app.get("db");
    ReplyService.insertReplies(knexInstance, newReply)
      .then(reply => {
        res
          .status(201)
          .location(`/api/replies/${reply.id}`)
          .json(reply);
      })
      .catch(next);
  });

replyRouter
  .route("/:id")
  .all((req, res, next) => {
    const { id } = req.params;
    const knexInstance = req.app.get("db");
    ReplyService.getById(knexInstance, id)
      .then(reply => {
        if (!reply) {
          return res
            .status(404)
            .send({ error: { message: `Reply doesn't exist` } });
        }
        res.reply = reply;
        next();
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json(serializedReplies(res.reply));
  })

  .delete((req, res, next) => {
    const { id } = req.params;
    const knexInstance = req.app.get("db");
    ReplyService.deleteReplies(knexInstance, id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })

  .patch(jsonParser, (req, res, next) => {
    const { id, reply, date_commented, postid } = req.body;
    const replyToUpdate = { id, reply, date_commented, postid };
    const knexInstance = req.app.get("db");

    ReplyService.updateReplies(knexInstance, req.params.id, replyToUpdate)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = replyRouter;
