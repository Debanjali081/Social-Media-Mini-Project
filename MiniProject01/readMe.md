# Social Media Mini Project

A full-stack social media web application that allows users to register, login, create posts, like/unlike posts, edit, and delete posts. This project leverages **Node.js**, **Express**, **MongoDB**, **JWT**, **bcrypt**, **Multer**, **EJS**, and **Tailwind CSS** to provide a secure, responsive, and dynamic platform.

## 🔗 Features

### Authentication
- **User Registration**: Secure sign-up with password hashing using **bcrypt**.
- **User Login**: Authentication managed with **JWT**, ensuring user sessions are secure.
- **Middleware Protection**: Routes are protected to ensure only authenticated users have access.

### Post Management
- **Create Posts**: Users can create text-based posts to share their thoughts.
- **Edit & Delete Posts**: Users can edit or delete their posts for better content management.
- **Like/Unlike Posts**: Users can engage with posts by liking or unliking, reflecting social interaction.
- **File Upload**: Users can upload profile pictures or images with their posts using **Multer**.

### User Interface
- **EJS Templating**: Dynamic rendering of user data, displaying personalized posts and interactions.
- **Tailwind CSS Styling**: A clean, responsive design with Tailwind CSS for a modern UI.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, JWT, bcrypt, Multer
- **Database**: MongoDB, Mongoose for schema modeling and data relationships
- **Frontend**: EJS for templating, Tailwind CSS for styling

## 🔧 Installation & Usage

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/social-media-mini-project.git
    cd social-media-mini-project
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Set Up Environment Variables**:
    - Create a `.env` file in the root directory with the following:
      ```plaintext
      MONGODB_URI=mongodb://127.0.0.1:27017/miniproject
      JWT_SECRET=your_jwt_secret
      ```

4. **Start the Server**:
    ```bash
    node app.js
    ```
   - The server will run on `http://localhost:3000`.

5. **Access the App**:
    - Go to `http://localhost:3000` to access the homepage.

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
| POST   | `/upload`       | Upload a profile picture (requires login) |



## 📚 Learnings

- **JWT-based Authentication** for secure user sessions.
- **CRUD Operations** with MongoDB.
- **Middleware** usage in Express for route protection.
- **File Upload Management** using Multer.
- Building a **responsive UI** with Tailwind CSS and EJS templating.

## 🤝 Contributing

1. **Fork the repository**
2. **Create a new branch** for your feature or bugfix.
3. **Commit your changes** and push the branch.
4. Open a **Pull Request** with a clear description of your changes.



### 📝 Author

Created by [Your Name](https://www.linkedin.com/in/yourprofile). Feel free to connect!

---

Happy coding!



### 📝 Author

Created by Debanjali Lenka (https://www.linkedin.com/in/debanjali-lenka/). Feel free to connect!
