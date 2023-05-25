-- Creamos la base de datos
CREATE DATABASE testdb;
-- Usamos la base de datos
USE testdb;

-- Creamos la tabla de usuarios
CREATE TABLE users(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL DEFAULT "Usuario",
  age TINYINT(3) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol SET ("estandar", "admin") DEFAULT "estandar",
  creado_en TIMESTAMP DEFAULT CURRENT_DATE,

  PRIMARY KEY (id),
  CONSTRAINT UNIQUE (email)
);

-- Creamos la tabla de publicaciones
CREATE TABLE posts(
	id INT UNSIGNED NOT NULL auto_increment,
 	id_user INT UNSIGNED NOT NULL,
 	description TEXT,
 	content TEXT NOT NULL,
 	likes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_DATE,
    
  PRIMARY KEY(id),
  CONSTRAINT FOREIGN KEY (id_user) REFERENCES users (id)
);

-- Creamos la tabla de comentarios
CREATE TABLE comments(
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_user INT NOT NULL,
  id_posts INT UNSIGNED NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_DATE,
  PRIMARY KEY(id),
  CONSTRAINT FOREIGN KEY (id_user) REFERENCES users (id),
  CONSTRAINT FOREIGN KEY (id_post) REFERENCES posts (id)
);

-- Registros
INSERT INTO users (name, age, email, password, rol) VALUES ("Joshua", 18, "joshuleal3@gmail.com", 123, "admin"); 

INSERT INTO posts (id_user, content) VALUES (1, "soy una papa");

INSERT INTO comments (id_user, id_post, content) VALUES (1, 1, "jaja sisoi"), (1, 1, "en efecto, sisoi"), (1, 1, "XD");

-- Sentencias SQL anidades
INSERT INTO comments (id_user, id_post, content) VALUES (
  (SELECT id FROM users WHERE email = "josh@gmail.com"),
  (SELECT id FROM posts WHERE content = "soy una papa"),
);

--LIKE
SELECT name FROM users WHERE email LIKE "%@root.com"; --root
SELECT name FROM users WHERE email NOT LIKE "%@root.com"; --gmail
SELECT * FROM users WHERE name LIKE "%o%";

-- BETWEEN
SELECT name FROM users WHERE age BETWEEN 18 AND 20; 
SELECT name FROM users WHERE age NOT BETWEEN 18 AND 20; 

-- SUM
SELECT SUM(age) AS suma_total FROM users;

-- COUNT
SELECT COUNT(name) AS usuarios_totales FROM users;
SELECT COUNT(name) AS administradores FROM users WHERE rol = "admin";

-- MIN
SELECT MIN(age) AS edad_menor FROM users;
-- MAX
SELECT MAX(age) AS edad_mayor FROM users;

-- Variables
SET @nombre = "Josh";
SELECT @nombre AS mi_nombre;

-- condicional IF
SELECT name, IF (age => 18, "es legal", "esta chikito hay que cuidarlo") FROM users;

-- PROCUDURE 
DELIMITER //

CREATE PROCEDURE get_comments_by_email(
	in email_user VARCHAR(50),
    in limit_comments INT UNSIGNED
)

BEGIN

	IF limit_comments != 0 THEN
    
      SELECT * FROM comments WHERE id_user = (SELECT id FROM users WHERE email = email_user) LIMIT limit_comments;
    
    ELSE 
    
      SELECT * FROM comments WHERE id_user = (SELECT id FROM users WHERE email = email_user);

    END IF;

END //

DELIMITER ;

-- Llamar un procedure
CALL get_comments_by_email("josh@gmail.com", 1); 


-- FUNCTION
DELIMITER //

CREATE FUNCTION is_an_user_active(email_user VARCHAR(50))
RETURNS VARCHAR(3)

BEGIN 

	SET @result = (SELECT status FROM users WHERE email = email_user);
    
    IF @result = 0 THEN
    	RETURN "No";
	ELSE 
    	RETURN "Yes";
   	END IF;

END //

DELIMITER ;

-- Llamar una funcion
SELECT is_an_user_active("josh@gmail.com") AS resultado;  