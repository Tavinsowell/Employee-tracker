-- View all departments
SELECT id, name FROM department;

-- View all roles
SELECT role.id, role.title, role.salary, department.name AS department
FROM role
JOIN department ON role.department_id = department.id;

-- View all employees
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager_first_name, manager.last_name AS manager_last_name
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
LEFT JOIN employee AS manager ON employee.manager_id = manager.id;

-- Add a department
INSERT INTO department (name) VALUES ($1);

-- Add a role
INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3);

-- Add an employee
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);

-- Update an employee role
UPDATE employee SET role_id = $1 WHERE id = $2;