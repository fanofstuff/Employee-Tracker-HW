var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "businessDB",
});

connection.connect(function (err) {
  if (err) throw err;
  runSearch();
});

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Departments",
        "View All Roles",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Update Employee Role",
        "Exit",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          allEmployees();
          break;
        case "View All Departments":
          viewDepartments();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Update Employee Role":
          updateRole();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

function allEmployees() {
  connection.query(
    "SELECT e.id, e.first_name AS First_Name, e.last_name AS Last_Name, role.title AS Title, department.name AS Department, role.salary AS Salary, CONCAT(m.first_name, ' ', m.last_name) AS Manager FROM employee e INNER JOIN role ON e.role_id=role.id INNER JOIN department ON role.department_id=department.id LEFT JOIN employee m ON m.id=e.manager_id ORDER BY e.id ASC",
    function (err, res) {
      console.table("All Employee Information", res);
      runSearch();
    }
  );
}

function viewDepartments() {
  connection.query("SELECT * FROM department", function (err, res) {
    console.table("All Departments", res);
    runSearch();
  });
}

function viewRoles() {
  connection.query(
    "SELECT role.id, role.title, role.salary, department.name AS department FROM role INNER JOIN department ON role.department_id=department.id",
    function (err, res) {
      console.table("All Roles", res);
      runSearch();
    }
  );
}

function addEmployee() {
  var roles = [];
  var managers = [];
  connection.query("SELECT title FROM role", function (err, res) {
    for (let i = 0; i < res.length; i++) {
      roles.push(res[i].title);
    }
    return roles;
  });
  connection.query(
    "SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee",
    function (err, res) {
      for (let i = 0; i < res.length; i++) {
        managers.push(res[i].name);
      }
      return managers;
    }
  );
  inquirer
    .prompt([
      {
        type: "input",
        name: "first",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "last",
        message: "What is the employee's last name?",
      },
      {
        type: "list",
        name: "role",
        message: "What is the employee's role?",
        choices: roles,
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the employee's manager?",
        choices: managers,
      },
    ])
    .then((answers) => {
      var roleID = [];
      var managerID = [];
      connection.query(
        "SELECT id FROM role WHERE title = ?",
        [answers.role],
        function (err, res) {
          for (let i = 0; i < res.length; i++) {
            roleID.push(res[i].id);
          }
          connection.query(
            "SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = ?",
            [answers.manager],
            function (err, res) {
              for (let i = 0; i < res.length; i++) {
                managerID.push(res[i].id);
              }
              connection.query(
                "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
                [answers.first, answers.last, roleID, managerID],
                function (err, res) {
                  runSearch();
                }
              );
            }
          );
        }
      );
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "What department should be added?",
      },
    ])
    .then((answers) => {
      connection.query(
        "INSERT INTO department (name) VALUES (?)",
        [answers.department],
        function (err, res) {
          runSearch();
        }
      );
    });
}

function addRole() {
  var departments = [];
  connection.query("SELECT name FROM department", function (err, res) {
    for (let i = 0; i < res.length; i++) {
      departments.push(res[i].name);
    }
    return departments;
  });
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What should the role by titled?",
      },
      {
        name: "salary",
        type: "input",
        message: "How much should this role make per year?",
      },
      {
        name: "department",
        type: "list",
        message: "What department should this role be a part of?",
        choices: departments,
      },
    ])
    .then((answers) => {
      var departmentID = [];
      connection.query(
        "SELECT id FROM department WHERE name = ?",
        [answers.department],
        function (err, res) {
          for (let i = 0; i < res.length; i++) {
            departmentID.push(res[i].id);
          }
          connection.query(
            "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
            [answers.title, answers.salary, departmentID],
            function (err, res) {
              runSearch();
            }
          );
        }
      );
    });
}

function updateRole() {
  var employees = [];
  var roles = [];
  connection.query(
    "SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee",
    function (err, res) {
      for (let i = 0; i < res.length; i++) {
        employees.push(res[i].name);
      }
      connection.query("SELECT title FROM role", function (err, res) {
        for (let i = 0; i < res.length; i++) {
          roles.push(res[i].title);
        }
        inquirer
          .prompt([
            {
              name: "employee",
              type: "list",
              message: "Who do you want to update?",
              choices: employees,
            },
            {
              name: "role",
              type: "list",
              message: "What role should they now have?",
              choices: roles,
            },
          ])
          .then((answers) => {
            var roleID = [];
            connection.query(
              "SELECT id FROM role WHERE title = ?",
              [answers.role],
              function (err, res) {
                for (let i = 0; i < res.length; i++) {
                  roleID.push(res[i].id);
                }
                connection.query(
                  "UPDATE employee SET role_id = ? WHERE CONCAT(first_name, ' ', last_name) = ?",
                  [roleID, answers.employee],
                  function (err, res) {
                    runSearch();
                  }
                );
              }
            );
          });
      });
    }
  );
}
