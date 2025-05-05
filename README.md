# Project Overview

Welcome to the Power BI and Backend Integration project. This project includes:

- A backend API to handle production and customer order data using FastAPI.
- A Power BI frontend (currently under construction) to visualize and analyze the data.


## Please refer to the README files for both the frontend and the backend

For detailed instructions, setup, and usage of the backend side of the application, please read the `README.md` files located under the `backend_BI` sub-directory and `frontend_bi` sub-directory respectively for the backend and the frontend side of the application. For each setup make sure that you navigate to designated directory.

# General Setup

1. Clone the repository:
    - HTTPS
    ```bash
    git clone https://github.com/zaddemraslen/PowerBI.git
    ```

    - SSH
    ```bash
    git clone git@github.com:zaddemraslen/PowerBI.git
    ```
    Use a password-protected SSH key.

    - GitHub CLI 
    ```bash
    gh repo clone zaddemraslen/PowerBI
    ```
    Requires GitHub CLI
2. Create a virtual environment:
    It is highly recommended to create a virtual environment to manage your project dependencies.

    - For macOS/Linux:
      ```bash
      python3 -m venv venv
      ```
    - For Windows:
      ```bash
      python -m venv venv
      ```

3. Activate the virtual environment:
    - For macOS/Linux:
      ```bash
      source venv/bin/activate
      ```
    - For Windows:
      ```bash
      .\venv\Scripts\activate
      ```
