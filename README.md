# Node.js REST API

This is a Node.js REST API that provides the following features:

* Authentication (using username and password)
* Create, edit, update, and delete functionality for users
* Forgot password API

To deploy this Node.js REST API to a local server, you will need to install the following software:

    Node.js
    MongoDB

Once you have installed the required software, you can follow these steps to deploy the API:

Clone the Git repository for the API to your local machine.
Navigate to the directory where the API code is located.
Dependencies

AuthApp relies on the following npm packages:

    bcrypt: For password hashing and verification.
    cookie-parser: For parsing cookies.
    dotenv: For loading environment variables from a .env file.
    express: A minimal and flexible Node.js web application framework.
    express-async-errors: For handling async errors in Express.
    http-status-codes: A library for HTTP status codes.
    jsonwebtoken: For creating and verifying JSON Web Tokens (JWT).
    mongoose: An ODM (Object Data Modeling) library for MongoDB.
    nodemailer: For sending emails.
    sendmail: For sending emails via Sendmail.
    validator: A library for data validation.
Install the API dependencies by running the following command:

    npm install

Start the API server by running the following command:

To start the server in development mode, run:

    npm run dev

To start the server in production mode, run:

    npm start

The API will be running on port 5000. You can access it at the following URL in your web browser:

    http://localhost:5000

# API Endpoints

This document outlines the available API endpoints for the application.

## User Routes

### Register a User

- **URL:** `/api/v1/register`
- **Method:** `POST`
- **Description:** Register a new user.
- **Authentication:** Not required.

### Login

- **URL:** `/api/v1/login`
- **Method:** `POST`
- **Description:** Log in with a registered user account.
- **Authentication:** Not required.

### Logout

- **URL:** `/api/v1/logout`
- **Method:** `GET`
- **Description:** Log out the currently logged-in user.
- **Authentication:** Required.

### Forgot Password

- **URL:** `/api/v1/password/forgot`
- **Method:** `POST`
- **Description:** Request a password reset email.
- **Authentication:** Not required.

### Reset Password

- **URL:** `/api/v1/password/reset/:token`
- **Method:** `PATCH`
- **Description:** Reset the user's password using a reset token.
- **Authentication:** Not required.

### Get User Details

- **URL:** `/api/v1/me`
- **Method:** `GET`
- **Description:** Get details of the currently logged-in user.
- **Authentication:** Required.

### Update User Profile

- **URL:** `/api/v1/me/update`
- **Method:** `PATCH`
- **Description:** Update the user's profile information.
- **Authentication:** Required.

### Update Password

- **URL:** `/api/v1/me/password/update`
- **Method:** `PATCH`
- **Description:** Update the user's password.
- **Authentication:** Required.

### Get All Users (Admin)

- **URL:** `/api/v1/admin/users`
- **Method:** `GET`
- **Description:** Get a list of all users (Admin only).
- **Authentication:** Required (Admin role).

### Get One User Detail (Admin)

- **URL:** `/api/v1/admin/user/:id`
- **Method:** `GET`
- **Description:** Get details of a specific user by ID (Admin only).
- **Authentication:** Required (Admin role).

### Update User Role (Admin)

- **URL:** `/api/v1/admin/user/:id`
- **Method:** `PATCH`
- **Description:** Update the role of a user (Admin only).
- **Authentication:** Required (Admin role).

### Delete User (Admin)

- **URL:** `/api/v1/admin/user/:id`
- **Method:** `DELETE`
- **Description:** Delete a user by ID (Admin only).
- **Authentication:** Required (Admin role).
