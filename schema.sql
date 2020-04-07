DROP DATABASE IF EXISTS businessDB;
CREATE database businessDB;

USE businessDB;

CREATE TABLE department (
  id INT NOT NULL,
  name VARCHAR(30) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL,
  title VARCHAR(30) NULL,
  salary DECIMAL(10,4) NULL,
  department_id INT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL,
  first_name VARCHAR(30) NOT NULL, 
  last_name VARCHAR(30) NOT NULL, 
  role_id INT NOT NULL, 
  manager_id INT, 
  PRIMARY KEY (id)
);

INSERT INTO department (id, name) 
VALUES (1, "Management"), (2, "PR"), (3, "Accounting")

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "CEO", 100000, 1), (2, "Chief Secretary", 80000, 1), (3, "Head of Staff", 90000, 2), (4, "Consultant", 60000, 2), (5, "Head of Accounting", 85000, 3), (6, "General Accountant", 60000, 3)

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Paul", "Blart", 1, ), (2, "Linda", "Larson", 2, 1), (3, "Herbert", "Wilson", 3, 2), (4, "Jacob", "Johnson", 5, 2), (5, "Michael", "Homeburt", 6, 4), (6, "Martha", "Marvin", 6, 4)
