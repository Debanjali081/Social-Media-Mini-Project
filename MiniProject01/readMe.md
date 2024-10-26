# Social Media Mini Project 

A full-stack social media web application that allows users to register, login, create posts, like/unlike posts, edit, and delete posts. This project leverages **Node.js**, **Express**, **MongoDB**, **JWT**, **bcrypt**, **EJS**, and **Tailwind CSS** to provide a secure, responsive, and dynamic platform.

## 🔗 Features

### Authentication
- **User Registration**: Secure sign-up with password hashing using **bcrypt**.
- **User Login**: Authentication managed with **JWT**, ensuring user sessions are secure.
- **Middleware Protection**: Routes are protected to ensure only authenticated users have access.

### Post Management
- **Create Posts**: Users can create text-based posts to share their thoughts.
- **Edit & Delete Posts**: Users can edit or delete their posts for better content management.
- **Like/Unlike Posts**: Users can engage with posts by liking or unliking, reflecting social interaction.

### User Interface
- **EJS Templating**: Dynamic rendering of user data, displaying personalized posts and interactions.
- **Tailwind CSS Styling**: A clean, responsive design with Tailwind CSS for a modern UI.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, JWT, bcrypt
- **Database**: MongoDB, Mongoose for schema modeling and data relationships
- **Frontend**: EJS for templating, Tailwind CSS for styling

## 📝 API Endpoints

| Method | Endpoint        | Description                      |
|--------|------------------|----------------------------------|
| GET    | `/`             | Homepage                         |
| GET    | `/login`        | Login page                       |
| POST   | `/register`     | Register a new user              |
| POST   | `/login`        | Log in an existing user          |
| GET    | `/profile`      | Profile page (requires login)    |
| POST   | `/post`         | Create a new post (requires login) |
| GET    | `/edit/:id`     | Edit a post (requires login)     |
| POST   | `/update/:id`   | Update post content              |
| GET    | `/like/:id`     | Like or unlike a post            |
| GET    | `/logout`       | Log out the user                 |

## 📚 Learnings

- **JWT-based Authentication** for secure user sessions.
- **CRUD Operations** with MongoDB.
- **Middleware** usage in Express for route protection.
- Building a **responsive UI** with Tailwind CSS and EJS templating.

## 🤝 Contributing

1. **Fork the repository**
2. **Create a new branch** for your feature or bugfix.
3. **Commit your changes** and push the branch.
4. Open a **Pull Request** with a clear description of your changes.

### 📝 Author

Created by Debanjali Lenka (https://www.linkedin.com/in/debanjali-lenka/). Feel free to connect!
