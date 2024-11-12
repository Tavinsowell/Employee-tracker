# Employee Tracker

Employee Tracker is a command-line application that allows users to manage a company's employee database. The application provides options to view departments, roles, and employees, as well as add new departments, roles, and employees, and update employee roles.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [Scripts](#scripts)
- [Technologies](#technologies)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/employee-tracker.git
    cd employee-tracker
    ```
2. Install the dependencies:
    ```sh
    npm install
    ```
3. Set up the database:
    - Ensure you have PostgreSQL installed and running.
    - Create a `.env` file in the root directory and add your database credentials:
      ```env
      DB_NAME=tracker_db
      DB_USER=postgres
      DB_PASSWORD=your_password
      ```
4. Create the database schema and seed the database:
    ```sh
    npm run create-schema
    npm run seed
    ```

## Usage

1. Build the TypeScript files:
    ```sh
    npm run build
    ```
2. Start the application:
    ```sh
    npm start
    ```
3. Follow the prompts to manage the employee database.

## Database Schema

The database schema consists of three tables: `department`, `role`, and `employee`.

**department:**
- `id`: SERIAL PRIMARY KEY
- `name`: VARCHAR(30)

**role:**
- `id`: SERIAL PRIMARY KEY
- `title`: VARCHAR(30)
- `salary`: DECIMAL(10, 2)
- `department_id`: INT (Foreign Key referencing `department(id)`)

**employee:**
- `id`: SERIAL PRIMARY KEY
- `first_name`: VARCHAR(30)
- `last_name`: VARCHAR(30)
- `role_id`: INT (Foreign Key referencing `role(id)`)
- `manager_id`: INT (Foreign Key referencing `employee(id)`)

## Scripts

- `build`: Compile TypeScript files to JavaScript.
- `start`: Build the project and start the application.
- `create-schema`: Create the database schema.
- `seed`: Seed the database with initial data.

## Technologies

- Node.js
- TypeScript
- PostgreSQL
- Inquirer.js
- dotenv

## Contribution

email: Tavinsowell@gmail.com
github: https://github.com/Tavinsowell