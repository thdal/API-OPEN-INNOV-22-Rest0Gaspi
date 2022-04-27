INSERT INTO profile (id, profile_name) VALUES (1,'Consommateur');
INSERT INTO profile (id, profile_name) VALUES (2,'Restaurateur');
INSERT INTO profile (id, profile_name) VALUES (3, 'Administrateur');

INSERT INTO type_menu (id,typeMenuName) VALUES (1,'Vegan');
INSERT INTO type_menu (id,typeMenuName) VALUES (2,'Gastronomie Française');
INSERT INTO type_menu (id,typeMenuName) VALUES (3,'Japonais');
INSERT INTO type_menu (id,typeMenuName) VALUES (4,'FastFood');
INSERT INTO type_menu (id,typeMenuName) VALUES (5,'Italien');

Insert into genre (id, genre_name) VALUES (1, 'F');
Insert into genre (id, genre_name) VALUES (2, 'H');

INSERT INTO users (firstName, lastName, email, password, genre_id) VALUES ('Admin', 'Admin', 'admin@epsi.fr', 'password123',2);

INSERT INTO user_profile (profile_id, user_id) VALUES(
 (select id from profile where profile_name = 'Administrateur') ,
 (select id from users where email = 'admin@epsi.fr')
 );
  INSERT INTO user_profile (profile_id, user_id) VALUES(
   (select id from profile where profile_name = 'Restaurateur') ,
   (select id from users where email = 'admin@epsi.fr')
   );
 INSERT INTO user_profile (profile_id, user_id) VALUES(
  (select id from profile where profile_name = 'Consommateur') ,
  (select id from users where email = 'admin@epsi.fr')
  );

