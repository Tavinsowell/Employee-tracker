import inquirer from 'inquirer';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;

// Create a connection to the database
const client = new Client({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
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
  }).then(answer => {
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
  client.query(query, (err, res) => {
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
  client.query(query, (err, res) => {
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
  client.query(query, (err, res) => {
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
  }).then(answer => {
    const query = 'INSERT INTO department (name) VALUES ($1)';
    client.query(query, [answer.name], (err, _res) => {
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
  ]).then(answers => {
    const query = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)';
    client.query(query, [answers.title, answers.salary, answers.department_id], (err, _res) => {
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
  ]).then(answers => {
    const { first_name, last_name, role_id, manager_id } = answers;

    // Convert role_id and manager_id to integers, or set manager_id to null if empty
    const roleId = parseInt(role_id);
    const managerId = manager_id ? parseInt(manager_id) : null;

    if (isNaN(roleId) || (manager_id !== null && isNaN(manager_id))) {
      console.error('Invalid input for role ID or manager ID. Please enter valid integers.');
      return startApp();
    }

    // Check if the role_id exists
    const roleQuery = 'SELECT id FROM role WHERE id = $1';
    client.query(roleQuery, [roleId], (err, res) => {
      if (err) throw err;
      if (res.rows.length === 0) {
        console.error('Role ID does not exist. Please enter a valid role ID.');
        return startApp();
      }

      // Check if the manager_id exists (if provided)
      if (managerId !== null) {
        const managerQuery = 'SELECT id FROM employee WHERE id = $1';
        client.query(managerQuery, [managerId], (err, res) => {
          if (err) throw err;
          if (res.rows.length === 0) {
            console.error('Manager ID does not exist. Please enter a valid manager ID.');
            return startApp();
          }

          // Insert the new employee
          const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
          client.query(query, [first_name, last_name, roleId, managerId], (err, _res) => {
            if (err) throw err;
            console.log('Employee added successfully.');
            startApp();
          });
        });
      } else {
        // Insert the new employee without manager_id
        const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
        client.query(query, [first_name, last_name, roleId, null], (err, _res) => {
          if (err) throw err;
          console.log('Employee added successfully.');
          startApp();
        });
      }
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
  ]).then(answers => {
    const query = 'UPDATE employee SET role_id = $1 WHERE id = $2';
    client.query(query, [answers.role_id, answers.employee_id], (err, _res) => {
      if (err) throw err;
      console.log('Employee role updated successfully.');
      startApp();
    });
  });
}