const knex = require("knex");
const app = require("../src/app");
const { makeRepliesArray } = require("./replies.fixtures");

describe("Reply Endpoints", function() {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  beforeEach("insert posts", () => {
    let testPosts = [
      {
        id: 1,
        title: "title1",
        content: "content1",
        date_created: "2029-01-22T16:28:32.615Z",
        forumid: 1
      },
      {
        id: 2,
        title: "title2",
        content: "content2",
        date_created: "2029-01-22T16:28:32.615Z",
        forumid: 2
      },
      {
        id: 3,
        title: "title3",
        content: "content3",
        date_created: "2029-01-22T16:28:32.615Z",
        forumid: 3
      },
      {
        id: 4,
        title: "title4",
        content: "content4",
        date_created: "2029-01-22T16:28:32.615Z",
        forumid: 4
      },
      {
        id: 5,
        title: "title5",
        content: "content5",
        date_created: "2029-01-22T16:28:32.615Z",
        forumid: 5
      },
      {
        id: 6,
        title: "title6",
        content: "content6",
        date_created: "2029-01-22T16:28:32.615Z",
        forumid: 6
      }
    ];

    return db.into("posts").insert(testPosts);
  });

  before("clean the table", () =>
    db.raw("TRUNCATE posts, replies RESTART IDENTITY CASCADE")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE posts, replies RESTART IDENTITY CASCADE")
  );

  describe("GET /api/replies", () => {
    context("Given no replies", () => {
      it("responds with 200 and an empty list", () => {
        return supertest(app)
          .get("/api/replies")
          .expect(200, []);
      });
    });

    context("Given there are replies in the database", () => {
      const testReplies = makeRepliesArray();

      beforeEach("insert replies", () => {
        return db.into("replies").insert(testReplies);
      });

      it("GET /replies responds with 200 and all of the replies", () => {
        return supertest(app)
          .get("/api/replies")
          .expect(200, testReplies);
      });
    });
  });

  describe("GET /api/replies/:reply_id", () => {
    context("Given no replies", () => {
      it("responds with 404", () => {
        const replyId = 123456;
        return supertest(app)
          .get(`/api/replies/${replyId}`)
          .expect(404, { error: { message: `Reply doesn't exist` } });
      });
    });

    context("Given there are replies in the database", () => {
      const testReply = [
        {
          id: 1,
          reply: "Test reply",
          date_commented: "2029-01-22T16:28:32.615Z",
          postid: 1
        }
      ];

      beforeEach("insert replies", () => {
        return db.into("replies").insert(testReply);
      });

      it("responds with 200 and the specified reply", () => {
        const replyId = 1;
        const expectedReply = testReply[replyId - 1];
        return supertest(app)
          .get(`/api/replies/${replyId}`)
          .expect(200, expectedReply);
      });
    });
  });

  describe("POST /api/replies", () => {
    it("creates a reply, responding with 201 and the new reply", () => {
      const newReply = {
        reply: "new test reply",
        postid: 1
      };
      return supertest(app)
        .post("/api/replies")
        .send(newReply)
        .expect(201)
        .expect(res => {
          expect(res.body.reply).to.eql(newReply.reply);
          expect(res.body.postid).to.eql(newReply.postid);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/replies/${res.body.id}`);
        })
        .then(res =>
          supertest(app)
            .get(`/api/replies/${res.body.id}`)
            .expect(res.body)
        );
    });
  });

  describe("DELETE /api/replies/:reply_id", () => {
    context("Given no replies", () => {
      it("responds with 404", () => {
        const replyId = 123456;
        return supertest(app)
          .delete(`/api/replies/${replyId}`)
          .expect(404, { error: { message: `Reply doesn't exist` } });
      });
    });

    context("Given there are replies in the database", () => {
      const testReplies = [
        {
          id: 1,
          reply: "Test reply title",
          date_commented: "2029-01-22T16:28:32.615Z",
          postid: 1
        },
        {
          id: 2,
          reply: "Test reply title2",
          date_commented: "2029-01-22T16:28:32.615Z",
          postid: 2
        }
      ];

      beforeEach("insert replies", () => {
        return db.into("replies").insert(testReplies);
      });

      it("responds with 204 and removes the reply", () => {
        const idToRemove = 1;
        const expectedReplies = testReplies.filter(
          reply => reply.id !== idToRemove
        );
        return supertest(app)
          .delete(`/api/replies/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get("/api/replies")
              .expect(expectedReplies)
          );
      });
    });
  });

  describe("PATCH /api/replies/:reply_id", () => {
    context("Given no replies", () => {
      it("responds with 404", () => {
        const replyId = 123456;
        return supertest(app)
          .patch(`/api/replies/${replyId}`)
          .expect(404, { error: { message: `Reply doesn't exist` } });
      });
    });

    context("Given there are replies in the database", () => {
      const testReplies = makeRepliesArray();

      beforeEach("insert replies", () => {
        return db.into("replies").insert(testReplies);
      });

      it("responds with 204 and updates the reply", () => {
        const idToUpdate = 2;

        const updateReply = {
          reply: "updated reply",
          postid: 1
        };

        const expectedReply = {
          ...testReplies[idToUpdate - 1],
          ...updateReply
        };

        return supertest(app)
          .patch(`/api/replies/${idToUpdate}`)
          .send(updateReply)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/replies/${idToUpdate}`)
              .expect(expectedReply)
          );
      });
    });
  });
});
