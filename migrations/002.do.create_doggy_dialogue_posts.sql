CREATE TABLE posts (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY, 
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date_created TIMESTAMP DEFAULT now() NOT NULL,
  forumid INTEGER REFERENCES forums(id) ON DELETE CASCADE NOT NULL
);