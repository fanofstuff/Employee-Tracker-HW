DROP DATABASE IF EXISTS businessDB;
CREATE database businessDB;

USE businessDB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary DECIMAL(10,4) NULL,
  department_id INT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL, 
  last_name VARCHAR(30) NOT NULL, 
  role_id INT NOT NULL, 
  manager_id INT, 
  PRIMARY KEY (id)
);

INSERT INTO department (name) 
VALUES ("Management"), ("PR"), ("Accounting"); 

INSERT INTO role (title, salary, department_id)
VALUES ("CEO", 100000, 1), ("Chief Secretary", 80000, 1), ("Head of Staff", 90000, 2), ("Consultant", 60000, 2), ("Head of Accounting", 85000, 3), ("General Accountant", 60000, 3); 

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Paul", "Blart", 1, NULL), ("Linda", "Larson", 2, 1), ("Herbert", "Wilson", 3, 2), ("Jacob", "Johnson", 5, 2), ("Michael", "Homeburt", 6, 4), ("Martha", "Marvin", 6, 4); 
