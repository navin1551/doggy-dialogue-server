CREATE TABLE replies (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  reply TEXT NOT NULL,
  date_commented TIMESTAMP DEFAULT now() NOT NULL,
  postid INTEGER REFERENCES posts(id) ON DELETE CASCADE NOT NULL
);