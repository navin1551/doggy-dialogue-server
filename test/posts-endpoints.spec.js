const knex = require("knex");
const app = require("../src/app");
const { makePostsArray } = require("./posts.fixtures");
const jwt = require("jsonwebtoken");

describe("Post Endpoints", function() {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw("TRUNCATE posts, replies RESTART IDENTITY CASCADE")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE posts, replies RESTART IDENTITY CASCADE")
  );

  describe("GET /api/posts", () => {
    context("Given no posts", () => {
      it("responds with 200 and an empty list", () => {
        return supertest(app)
          .get("/api/posts")
          .expect(200, []);
      });
    });

    context("Given there are posts in the database", () => {
      const testPosts = makePostsArray();

      beforeEach("insert posts", () => {
        return db.into("posts").insert(testPosts);
      });

      it("GET /posts responds with 200 and all of the posts", () => {
        return supertest(app)
          .get("/api/posts")
          .expect(200, testPosts);
      });
    });
  });

  describe("GET /api/posts/:post_id", () => {
    context("Given no posts", () => {
      it("responds with 404", () => {
        const postId = 123456;
        return supertest(app)
          .get(`/api/posts/${postId}`)
          .expect(404, { error: { message: `Post doesn't exist` } });
      });
    });

    context("Given there are posts in the database", () => {
      const testPost = [
        {
          id: 1,
          title: "Test title",
          content: "Test content",
          date_created: "2029-01-22T16:28:32.615Z",
          forumid: 1
        }
      ];

      beforeEach("insert posts", () => {
        return db.into("posts").insert(testPost);
      });

      it("responds with 200 and the specified post", () => {
        const postId = 1;
        const expectedPost = testPost[postId - 1];
        return supertest(app)
          .get(`/api/posts/${postId}`)
          .expect(200, expectedPost);
      });
    });
  });

  /*describe("POST /api/posts", () => {
    it("creates a post, responding with 201 and the new post", () => {
      const newPost = {
        title: "Test new post",
        content: "Test new content",
        forumid: 1
      };

      return supertest(app)
        .post("/api/posts")
        .send(newPost)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(newPost.title);
          expect(res.body.content).to.eql(newPost.content);
          expect(res.body.forumid).to.eql(newPost.forumid);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/posts/${res.body.id}`);
        })
        .then(res =>
          supertest(app)
            .get(`/api/posts/${res.body.id}`)
            .expect(res.body)
        );
    });
  });*/

  describe("DELETE /api/posts/:posts_id", () => {
    context("Given no posts", () => {
      it("responds with 404", () => {
        const postId = 123456;
        return supertest(app)
          .delete(`/api/posts/${postId}`)
          .expect(404, { error: { message: `Post doesn't exist` } });
      });
    });

    context("Given there are posts in the database", () => {
      const testPosts = [
        {
          id: 1,
          title: "Test title",
          content: "Test content",
          date_created: "2029-01-22T16:28:32.615Z",
          forumid: 1
        },
        {
          id: 2,
          title: "Test title2",
          content: "Test content2",
          date_created: "2029-01-22T16:28:32.615Z",
          forumid: 2
        }
      ];

      beforeEach("insert posts", () => {
        return db.into("posts").insert(testPosts);
      });

      it("responds with 204 and removes the article", () => {
        const idToRemove = 1;
        const expectedPosts = testPosts.filter(post => post.id !== idToRemove);
        return supertest(app)
          .delete(`/api/posts/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get("/api/posts")
              .expect(expectedPosts)
          );
      });
    });
  });

  describe("PATCH /api/posts/:post_id", () => {
    context("Given no posts", () => {
      it("responds with 404", () => {
        const postId = 123456;
        return supertest(app)
          .patch(`/api/posts/${postId}`)
          .expect(404, { error: { message: `Post doesn't exist` } });
      });
    });

    context("Given there are posts in the database", () => {
      const testPosts = makePostsArray();

      beforeEach("insert posts", () => {
        return db.into("posts").insert(testPosts);
      });

      it("responds with 204 and updates the post", () => {
        const idToUpdate = 2;

        const updatePost = {
          title: "updated post title",
          content: "updated post content",
          forumid: 1
        };

        const expectedPost = {
          ...testPosts[idToUpdate - 1],
          ...updatePost
        };

        return supertest(app)
          .patch(`/api/posts/${idToUpdate}`)
          .send(updatePost)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/posts/${idToUpdate}`)
              .expect(expectedPost)
          );
      });
    });
  });
});
