-- Insert departments
INSERT INTO department (name) VALUES ('Engineering');
INSERT INTO department (name) VALUES ('Finance');
INSERT INTO department (name) VALUES ('Human Resources');
INSERT INTO department (name) VALUES ('Sales');

-- Insert roles
INSERT INTO role (title, salary, department_id) VALUES ('Software Engineer', 80000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Accountant', 60000, 2);
INSERT INTO role (title, salary, department_id) VALUES ('HR Manager', 75000, 3);
INSERT INTO role (title, salary, department_id) VALUES ('Sales Manager', 70000, 4);

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Smith', 2, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Emily', 'Jones', 3, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Michael', 'Brown', 4, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Sarah', 'Davis', 1, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('David', 'Wilson', 2, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Laura', 'Taylor', 3, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('James', 'Anderson', 4, 4);