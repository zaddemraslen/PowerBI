# Production & Commande API

This project is a backend API designed for managing production and customer order data. It is built using FastAPI and integrates with a SQL database to handle data storage and retrieval. The API allows you to perform CRUD operations on production and customer orders, as well as provide utility endpoints for general tasks like data deletion.

## Features

- **Customer Orders (Commande)**: CRUD operations for managing customer orders.
- **Production Records**: CRUD operations for managing production records.
- **General Utilities**: Endpoints for bulk operations like data deletion.

## Technologies Used

- **FastAPI**: Web framework for building APIs.
- **SQLAlchemy**: ORM for interacting with the database.
- **Pydantic**: Data validation and serialization.
- **MS SQL Server**: Database used for storing data.
- **Python-dotenv**: For managing environment variables.

## Project Structure

### `/app`

The main directory of the application.

- **`/models`**: Contains the SQLAlchemy ORM models that map to the database tables.
- **`/schemas`**: Contains Pydantic models used for validation and serialization of data.
- **`/crud`**: Contains functions to interact with the database, such as creating, reading, updating, and deleting records.
- **`/routes`**: Contains all the route modules for the API, grouped by functionality.
- **`/database`**: Contains the database connection logic and session management.
- **`/main.py`**: The entry point for the FastAPI application.

### `/routes`

Contains modules for handling the API endpoints.

- **`routes_commande.py`**: Endpoints related to managing customer orders (commandes).
- **`routes_production.py`**: Endpoints related to managing production records.
- **`routes_common.py`**: General utility endpoints, such as full data deletion.
- **`routes_main.py`**: The main router, which includes all the route modules.

### `/models`

Contains the SQLAlchemy ORM models for the application.

- **`model_commande.py`**: Defines the CommandeModel for managing customer orders.
- **`model_production.py`**: Defines the ProductionModel for managing production records.

### `/schemas`

Contains Pydantic schemas used for validating and serializing API data.

- **`schema_commande.py`**: Defines the Pydantic models for Commande data.
- **`schema_production.py`**: Defines the Pydantic models for Production data.

### `/crud`

Contains functions for interacting with the database, including CRUD operations.

- **`crud_commande.py`**: Functions for interacting with the Commande table.
- **`crud_production.py`**: Functions for interacting with the Production table.
- **`crud_common.py`**: General functions for utility tasks, like deleting all records.

### `/database`

Contains the database connection logic and session management.

- **`database.py`**: Handles database connections, sessions, and environment variable loading.

### `save_sqldb.py`
Once executed, reads from the excel data file, create and populate the database

### `read_excel.py`
Once executed, generates a summary of the existing data of the Excel file as a "outpu.txt" file under the logs directory.

### `/logs`
contains the generated "output.txt" file once the "read_excel.py" was executed for summary's data investigation

## Installation and setup

### Prerequisites
Make sure the that you navigated to the backend directory.
Before you begin, ensure that you have the following installed on your machine:

- Python "3.13.3" or later : "3.13.3" version was used
- pip (Python package installer): "pip 25.0.1" was used

### Setting Up the Project Environment
1. Install the required dependencies:
    To run the application, navigate to the backend-BI/app directory and execute the following command:
    ```bash
    pip install -r requirements.txt
    ```

2. Set up your environment variables in a `.env` file. Here’s an example `.env` file:
    `.env` would normally be ignored in `.gitignore`.⚠️ For demo/testing only. Never commit real credentials in production.

    ```env
    DB_SERVER=your_database_server
    DB_DATABASE=your_database_name
    DB_USERNAME=your_database_username
    DB_PASSWORD=your_database_password
    DB_DRIVER=ODBC+Driver+17+for+SQL+Server
    ```

## Database Setup (SQL Server)

### 1. Install SQL Server and Tools

- Download and install **SQL Server Developer Edition**:  
  https://www.microsoft.com/en-us/sql-server/sql-server-downloads

- During setup, choose **Custom Installation** and create a **Named Instance**, e.g., `localhost\SQLEXPRESS`.

- Ensure the firewall allows inbound TCP traffic on port **1433** (SQL Server default).

- Install **SQL Server Management Studio (SSMS)**:  
  https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms

### 2. Configure SQL Server Services

- Open **SQL Server Configuration Manager**.
- Under **SQL Server Services**, ensure: `SQL Server (SQLEXPRESS)` is **running**.

### 3. Create the Database and SQL Login

1. Connect to SQL Server using **Windows Authentication** in SSMS and run:

```sql
-- Create a login
CREATE LOGIN alma WITH PASSWORD = '123456';

-- Set default DB
ALTER LOGIN alma WITH DEFAULT_DATABASE = MatisAeroDB;

-- Create the database
CREATE DATABASE MatisAeroDB;
GO
USE MatisAeroDB;

-- Create a user linked to the login
CREATE USER alma FOR LOGIN alma;

-- Grant permissions
EXEC sp_addrolemember 'db_datareader', 'alma';
EXEC sp_addrolemember 'db_datawriter', 'alma';
EXEC sp_addrolemember 'db_owner', 'alma';

-- Verify permissions
EXEC sp_helpuser 'alma';
```
2. Run the application:
    - To run the application, first navigate to the backend-BI directory,
   run the "save_sqldb.py" file to create and populate the database from "Matis_Aerospace_Complet.xlsx" file:
    ```bash
    python save_sqldb.py
    ```
    - (optional) Run "read_excel.py" file to investigate the data from "Matis_Aerospace_Complet.xlsx" file:
   ```bash
    python read_excel.py
    ```
    Once executed, an "output.txt" would be generated under "logs" with a summary of the existing data, or simply consult the excel file directly.
 3. execute the following command to launch the backend side of the application as follows:
    ```bash
    uvicorn app.main:app --reload
    ```

4. Access the API at [http://localhost:8000](http://localhost:8000).

## API Documentation

Once the application is running, you can access the interactive API documentation at:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc UI**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Routes Overview

### Commandes (Customer Orders)

- `GET /commandes`: Get all commandes.
- `GET /commandes/{commande_id}`: Get a specific commande by ID.
- `GET /commandes/filter/without-production`: Get commandes that don't have an associated production record.
- `POST /commandes`: Create a new commande.
- `PUT /commande/{commande_id}`: Update an existing commande.
- `DELETE /commande/{commande_id}`: Delete a specific commande by ID.
- `DELETE /commandes/without-production`: Delete commandes without an associated production record.
- `DELETE /commandes`: Delete all commandes (requires confirmation).

### Productions (Production Records)

- `GET /productions`: Get all production records.
- `GET /productions/flat`: Get all production records in a flat format.
- `GET /productions/{production_id}`: Get a specific production by ID.
- `GET /productions/flat/{production_id}`: Get a specific production in a flat format.
- `GET /productions/by_command_id/{commande_id}`: Get all production records for a specific commande.
- `GET /productions/by_command_id/flat/{commande_id}`: Get all production records in a flat format for a specific commande.
- `POST /productions`: Create a new production.
- `PUT /production/{production_id}`: Update a production record.
- `DELETE /production/{production_id}`: Delete a specific production record by ID.
- `DELETE /productions`: Delete all production records (requires confirmation).

### General Utilities

- `DELETE /everything`: Delete all data in the database (requires confirmation).

## Error Handling

The API provides proper error handling for the following cases:

- **404 Not Found**: If a record is not found for a given ID.
- **400 Bad Request**: If an invalid request is made, such as missing required data or attempting an operation on a non-existent record.
- **500 Internal Server Error**: If an unexpected error occurs during processing.
