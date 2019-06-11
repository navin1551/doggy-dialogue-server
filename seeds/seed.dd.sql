BEGIN;

TRUNCATE
  forums,
  users,
  posts,
  replies
  RESTART IDENTITY CASCADE;

INSERT INTO forums (title)
VALUES
  ('Introductions'),
  ('Dog Grooming'),
  ('Dog Health'),
  ('Dog Training and Behavior'),
  ('Dog Food'),
  ('General Dog Discussion'),
  ('Dog Shows'),
  ('Working Dogs'),
  ('Dog Sports'),
  ('Dog News'),
  ('Dog Stories'),
  ('Dog Memorials'),
  ('Dog Breeds');

INSERT INTO users (user_name, password)
VALUES
('User2', '$2a$12$fqdA45z8bGKsaxnE3KyjVO5HScjZEu4dZmJorlhv1Vpjj2F0ubHVG'),
('User3', '$2a$12$4mSe8R3vJen.KTLpdJCIGeEKidqPyebgT4hWQAFz5204UGEnZrfcq'),
('User4', '$2a$12$hHg21Wx450d.t7e4bJMw4ub83VfAzvO7aqOsR4DCBOIXsaTeIHW82'),
('User5', '$2a$12$oNiKytzw38lFPidS8N.wV.hwHuLY3cjhNk87uRZmiKsEo3BFMD74C'),
('User6', '$2a$12$WvhRt6CHA3lrzOGHB64/jOAjFNT2wTvJ5bL2tK4MzaqD5qxS/NClG'),
('User7', '$2a$12$kcdyiJHv8xVJ10r0e46dIeK8U82oqugHWZRzmgCshCsNWt5LeZDem');



INSERT INTO posts (title, content, forumid, userid)
VALUES
('Title1', 'Content1', '1', '1'),
('Title2', 'Content2', '2', '2'),
('Title3', 'Content3', '3', '3'),
('Title4', 'Content4', '4', '4'),
('Title5', 'Content5', '5', '5'),
('Title6', 'Content6', '6', '6');

INSERT INTO replies (reply, postid, userid)
VALUES
('Reply1', '1', '1'),
('Reply2', '2', '2'),
('Reply3', '3', '3'),
('Reply4', '4', '4'),
('Reply5', '5', '5'),
('Reply6', '6', '6');

COMMIT;

