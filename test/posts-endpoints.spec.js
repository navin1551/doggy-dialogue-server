const knex = require("knex");
const app = require("../src/app");

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
    db.raw("TRUNCATE forums, posts, replies RESTART IDENTITY CASCADE")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE forums, posts, replies RESTART IDENTITY CASCADE")
  );

  context("Given there are posts in the database", () => {
    const testPost = [
      {
        id: 1,
        title: "Test title",
        content: "Test content",
        date_created: "2029-01-22T16:28:32.615Z",
        forumid: 9
      }
    ];

    beforeEach("insert posts", () => {
      return db.into("posts").insert(testPost);
    });

    it("GET /posts responds with 200 and all of the posts", () => {
      return supertest(app)
        .get("/posts")
        .expect(200);
    });
  });
});
