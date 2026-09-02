PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE guestbook (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, note TEXT, badge TEXT DEFAULT 'Founding Visitor', signed_at TEXT);
INSERT INTO "guestbook" ("id","name","note","badge","signed_at") VALUES(1,'Papa Weird.Baby','aka Mike Lang. I built the place.','Founding Visitor','2026-04-10 17:58:46');
INSERT INTO "guestbook" ("id","name","note","badge","signed_at") VALUES(2,'James E','Strangers looking out for each other for no reason other than it''s the right thing to do.','Founding Visitor','2026-04-20 14:55:57');
INSERT INTO "guestbook" ("id","name","note","badge","signed_at") VALUES(5,'Larry Leibensperger','The Kindness of a gentlemen (Mike) trying to help others!','Founding Visitor','2026-05-31 13:56:35');
INSERT INTO "guestbook" ("id","name","note","badge","signed_at") VALUES(6,'Sammy B','Hi dad!!!','Founding Visitor','2026-07-05 17:52:04');
INSERT INTO "guestbook" ("id","name","note","badge","signed_at") VALUES(7,'Mo','Love','Founding Visitor','2026-07-16 12:19:34');
INSERT INTO "guestbook" ("id","name","note","badge","signed_at") VALUES(8,'Tommy','History.','Founding Visitor','2026-08-03 19:25:36');
INSERT INTO "guestbook" ("id","name","note","badge","signed_at") VALUES(9,'Weird.Baby',replace('My birthday, I guess! \nWeird.Baby is open for business!','\n',char(10)),'Founding Visitor','2026-08-17 04:00:05');
