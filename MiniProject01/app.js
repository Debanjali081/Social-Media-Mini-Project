const express = require('express');
const app = express();
const userModel = require('./models/user'); // Import user model
const postModel = require('./models/post'); // Import post model
const cookieParser = require('cookie-parser'); // Middleware for parsing cookies
const bcrypt = require('bcrypt'); // Library for hashing passwords
const jwt = require('jsonwebtoken'); // Library for handling JSON Web Tokens
const path = require('path'); // Module for working with file and directory paths
const upload = require('./config/multer.config'); // Middleware for handling file uploads

// Set up Path and Configuration
app.set("view engine", "ejs"); // Set EJS as the templating engine
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the 'public' directory
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Use cookie-parser middleware

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
    if (!req.cookies.token) {
        return res.redirect('/login'); // Redirect to login if no token found
    } else {
        try {
            // Verify token and attach user data to the request
            let data = jwt.verify(req.cookies.token, "secret");
            req.user = data; // Store user data in the request
            next(); // Proceed to the next middleware/route handler
        } catch (error) {
            res.status(403).send("Invalid token"); // Send error if token is invalid
        }
    }
};

// Route for the homepage
app.get('/', (req, res) => {
    res.render("index"); // Render the index view
});

// Route for uploading a profile picture
app.get('/profile/upload', (req, res) => {
    res.render("profileUpload"); // Render the profile upload view
});

// Route to handle file uploads
app.post('/upload', isLoggedIn, upload.single("image"), async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }); // Find user by email
    user.profilepic = req.file.filename; // Set the profile picture filename
    await user.save(); // Save user changes
    res.redirect('/profile'); // Redirect to profile page
});

// Route for the login page
app.get('/login', (req, res) => {
    res.render("login"); // Render the login view
});

// Route to display the user's profile
app.get('/profile', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("posts"); // Find user and populate posts
    res.render('profile', { user }); // Render the profile view with user data
});

// Route to like/unlike a post
app.get('/like/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.id }).populate("user"); // Find the post by ID
    // Check if the user has already liked the post
    if (post.likes.indexOf(req.user.userid) === -1) {
        post.likes.push(req.user.userid); // Add user ID to likes
    } else {
        post.likes.splice(post.likes.indexOf(req.user.userid), 1); // Remove user ID from likes
    }

    await post.save(); // Save post changes
    res.redirect('/profile'); // Redirect to profile page
});

// Route to edit a post
app.get('/edit/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.id }).populate("user"); // Find the post by ID
    res.render("edit", { post }); // Render the edit view with post data
});

// Route to update a post
app.post("/update/:id", async (req, res) => {
    // Find the post by ID and update its content
    let post = await postModel.findOneAndUpdate({ _id: req.params.id }, { content: req.body.content }).populate("user");
    res.redirect("/profile"); // Redirect to profile page
});

// Route to delete a post
app.get('/delete/:id', isLoggedIn, async (req, res) => {
    try {
        // Find the post by ID
        let post = await postModel.findById(req.params.id);

        // Check if the post exists and if the user is the owner of the post
        if (!post || post.user.toString() !== req.user.userid) {
            return res.status(403).send("Unauthorized or post not found"); // Send error if unauthorized
        }

        // Delete the post
        await postModel.deleteOne({ _id: req.params.id });

        // Remove the post reference from the user's posts array
        await userModel.updateOne(
            { _id: req.user.userid },
            { $pull: { posts: req.params.id } }
        );

        res.redirect('/profile'); // Redirect to profile page
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while deleting the post"); // Send error if an exception occurs
    }
});

// Route to handle user registration
app.post("/register", async (req, res) => {
    let { email, password, name, username, age } = req.body;

    // Check if the user already exists
    let user = await userModel.findOne({ email });
    if (user) return res.status(500).send("User already registered"); // Send error if user already exists

    // Hash the password
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return res.status(500).send("Error generating salt");

        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) return res.status(500).send("Error hashing password");

            // Create the new user
            let newUser = await userModel.create({
                username,
                email,
                age,
                name,
                password: hash, // Save the hashed password
            });

            // Generate a token with the newly created user's id
            let token = jwt.sign({ email: email, userid: newUser._id }, "secret");
            res.cookie("token", token); // Set the token as a cookie
            res.send("You Are Registered"); // Send success message
        });
    });
});

// Route to handle user login
app.post('/login', async (req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) return res.status(500).send("User not found"); // Send error if user is not found

    // Compare passwords
    bcrypt.compare(password, user.password, (err, result) => {
        if (err) return res.status(500).send("Error comparing passwords");

        if (result) {
            let token = jwt.sign({ email: email, userid: user._id }, "secret"); // Generate token
            res.cookie("token", token); // Set token as a cookie
            res.status(200).redirect('/profile'); // Redirect to profile
        } else {
            res.redirect('/login'); // Redirect to login if password does not match
        }
    });
});

// Route to handle user logout
app.get('/logout', (req, res) => {
    res.cookie("token", ""); // Clear the token cookie
    res.render('login'); // Render the login view
});

// Route to create a new post
app.post('/post', isLoggedIn, async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Log the request body for debugging

        let user = await userModel.findOne({ email: req.user.email }); // Find user by email

        if (!user) {
            return res.status(404).send('User not found'); // Send error if user not found
        }

        let { content } = req.body; // Extract content from request body
        let post = await postModel.create({
            user: user._id,
            content // Create new post
        });

        // Ensure `user.posts` is an array, and prevent nested arrays by using spread syntax
        user.posts = [...(user.posts || []), post._id];

        await user.save(); // Save user changes

        res.redirect('/profile'); // Redirect to profile
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while creating the post'); // Send error if an exception occurs
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server started on port 3000"); // Log the server startup
});



