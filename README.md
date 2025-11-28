# Employee List Application

This is a simple employee management application built with React, TypeScript, and Vite. It allows users to add new employees through a multi-step wizard and view the list of all employees.

## Features

- **View Employee List**: See a list of all employees.
- **Add New Employee**: A multi-step wizard to add new employees to the list.
- **Image Upload**: Upload a profile picture for a new employee.
- **Mock API**: Uses `json-server` to provide a mock backend for employee data.

## Running the Application with Docker

The application is containerized using Docker and Docker Compose.

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) installed and running.

### Instructions

1.  **Build and Run the Application**

    Open your terminal, navigate to the project root directory, and run the following command:

    ```bash
    docker-compose up -d --build
    ```

    This command will build the Docker image for the application and start all the necessary services in the background.

2.  **Access the Application**

    Once the containers are running, you can access the application in your web browser at the following URL:

    [http://localhost:8080](http://localhost:8080)

    The application also uses two mock API services, which are available at:
    - `http://localhost:4001`
    - `http://localhost:4002`

3.  **Stopping the Application**

    To stop the application and all related services, run the following command in your terminal:

    ```bash
    docker-compose down
    ```

This will stop and remove the containers defined in the `docker-compose.yml` file.