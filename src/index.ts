const inquirer = require('inquirer');
const { Client } = require('pg');
const cTable = require('console.table');

// Create a connection to the database
const client = new Client({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'tracker_db'
});

client.connect((err: Error) => {
  if (err) throw err;
  console.log('Connected to the database.');
  startApp();
});

function startApp() {
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Exit'
    ]
  }).then((answer: { action: string }) => {
    switch (answer.action) {
      case 'View all departments':
        viewAllDepartments();
        break;
      case 'View all roles':
        viewAllRoles();
        break;
      case 'View all employees':
        viewAllEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateEmployeeRole();
        break;
      case 'Exit':
        client.end();
        break;
    }
  });
}

function viewAllDepartments() {
  const query = 'SELECT id, name FROM department';
  client.query(query, (err: Error, res: any) => {
    if (err) throw err;
    console.table(res.rows);
    startApp();
  });
}

function viewAllRoles() {
  const query = `
    SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    JOIN department ON role.department_id = department.id
  `;
  client.query(query, (err: Error, res: any) => {
    if (err) throw err;
    console.table(res.rows);
    startApp();
  });
}

function viewAllEmployees() {
  const query = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
  `;
  client.query(query, (err: Error, res: any) => {
    if (err) throw err;
    console.table(res.rows);
    startApp();
  });
}

function addDepartment() {
  inquirer.prompt({
    name: 'name',
    type: 'input',
    message: 'Enter the name of the department:'
  }).then((answer: { name: string }) => {
    const query = 'INSERT INTO department (name) VALUES ($1)';
    client.query(query, [answer.name], (err: Error) => {
      if (err) throw err;
      console.log('Department added successfully.');
      startApp();
    });
  });
}

function addRole() {
  inquirer.prompt([
    {
      name: 'title',
      type: 'input',
      message: 'Enter the title of the role:'
    },
    {
      name: 'salary',
      type: 'input',
      message: 'Enter the salary for the role:'
    },
    {
      name: 'department_id',
      type: 'input',
      message: 'Enter the department ID for the role:'
    }
  ]).then((answers: { title: string, salary: string, department_id: string }) => {
    const query = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)';
    client.query(query, [answers.title, answers.salary, answers.department_id], (err: Error, _res: any) => {
      if (err) throw err;
      console.log('Role added successfully.');
      startApp();
    });
  });
}

function addEmployee() {
  inquirer.prompt([
    {
      name: 'first_name',
      type: 'input',
      message: 'Enter the first name of the employee:'
    },
    {
      name: 'last_name',
      type: 'input',
      message: 'Enter the last name of the employee:'
    },
    {
      name: 'role_id',
      type: 'input',
      message: 'Enter the role ID for the employee:'
    },
    {
      name: 'manager_id',
      type: 'input',
      message: 'Enter the manager ID for the employee (if any):'
    }
  ]).then((answers: { first_name: string, last_name: string, role_id: string, manager_id: string }) => {
    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
    client.query(query, [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], (err: Error, _res: any) => {
      if (err) throw err;
      console.log('Employee added successfully.');
      startApp();
    });
  });
}

function updateEmployeeRole() {
  inquirer.prompt([
    {
      name: 'employee_id',
      type: 'input',
      message: 'Enter the ID of the employee you want to update:'
    },
    {
      name: 'role_id',
      type: 'input',
      message: 'Enter the new role ID for the employee:'
    }
  ]).then((answers: { employee_id: string, role_id: string }) => {
    const query = 'UPDATE employee SET role_id = $1 WHERE id = $2';
    client.query(query, [answers.role_id, answers.employee_id], (err: Error, _res: any) => {
      if (err) throw err;
      console.log('Employee role updated successfully.');
      startApp();
    });
  });
}