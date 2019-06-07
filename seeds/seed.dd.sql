INSERT INTO forums (title)
  VALUES
  ('One'),
  ('Two'),
  ('Three'),
  ('Four'),
  ('Five'),
  ('Six');



INSERT INTO posts (title, content, forumid)
VALUES
('Title1', 'Content1', '1'),
('Title2', 'Content2', '2'),
('Title3', 'Content3', '3'),
('Title4', 'Content4', '4'),
('Title5', 'Content5', '5'),
('Title6', 'Content6', '6');

INSERT INTO replies (reply, postid)
VALUES
('Reply1', '1'),
('Reply2', '2'),
('Reply3', '3'),
('Reply4', '4'),
('Reply5', '5'),
('Reply6', '6');


INSERT INTO users (full_name, password)
VALUES
('User2', 'password2'),
('User3', 'password3'),
('User4', 'password4'),
('User5', 'password5'),
('User6', 'password6'),
('User7', 'password7');
