# Product Management RBAC (React)

This is the frontend application for the Laravel-based Auth Service. It is built using React and communicates with a Go-based Product Service via JWT authentication. It supports Role-Based Access Control (RBAC) to provide different views and actions for Admin and User roles.

## Features

- Login (Admin & User)
- User Registration
- Role-Based Access Handling (Admin/User)
- View Product List
    - Users: 
        - View only active products
        - Search by name or description
    - Admins: 
        - View all products
        - Create, Update and Delete Product
        - Change product status (active/inactive)
        - Search by name or description
        - Filter by status
- Token storage using localStorage
- Protected Routes
- Lazy Load Product Image

## Tech Stack
- Framework : React
- Language : JavaScript
- HTTP Client : Axios
- Routing : React Router DOM
- Styling : Tailwind CSS
- Auth Method : JWT (from Laravel backend)


## 🚀 Setup
1. **Navigate to the Frontend directory**
   ```
    cd ags-microservices/frontend
   ```
2. **Install dependencies**
   ```
   npm install
   ```
3. **Run the React Project**
   ```
   npm start
   ```
