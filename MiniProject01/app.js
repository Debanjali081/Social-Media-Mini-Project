const express = require('express');
const app = express();
const userModel = require('./models/user');
const postModel = require('./models/post');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Set up Path and Configuration
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
    if (!req.cookies.token) {
        return res.redirect('/login')
    } else {
        try {
            let data = jwt.verify(req.cookies.token, "secret");
            req.user = data;
            next();
        } catch (error) {
            res.status(403).send("Invalid token");
        }
    }
};

app.get('/', (req, res) => {
    res.render("index");
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/profile', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("posts");
    res.render('profile', { user });
});

app.get('/like/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.id }).populate("user")
    if (post.likes.indexOf(req.user.userid) === -1) {
        post.likes.push(req.user.userid)
    }
    else {
        post.likes.splice(post.likes.indexOf(req.user.userid), 1);
    }

    await post.save()

    res.redirect('/profile')
})

app.get('/edit/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.id }).populate("user")
    res.render("edit", { post })

})

app.post("/update/:id", async (req, res) => {
    let post = await postModel.findOneAndUpdate({ _id: req.params.id }, { content: req.body.content }).populate("user")
    res.redirect("/profile")
})

app.get('/delete/:id', isLoggedIn, async (req, res) => {
    try {
        // Find the post by ID and delete it
        let post = await postModel.findById(req.params.id);

        // Check if the post exists and if the user is the owner of the post
        if (!post || post.user.toString() !== req.user.userid) {
            return res.status(403).send("Unauthorized or post not found");
        }

        // Delete the post
        await postModel.deleteOne({ _id: req.params.id });

        // Remove the post reference from the user's `posts` array
        await userModel.updateOne(
            { _id: req.user.userid },
            { $pull: { posts: req.params.id } }
        );

        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while deleting the post");
    }
});


app.post("/register", async (req, res) => {
    let { email, password, name, username, age } = req.body;

    // Check if the user already exists
    let user = await userModel.findOne({ email });
    if (user) return res.status(500).send("User already registered");

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
                password: hash,
            });

            // Generate a token with the newly created user's id
            let token = jwt.sign({ email: email, userid: newUser._id }, "secret");
            res.cookie("token", token);
            res.send("You Are Registered");
        });
    });
});

app.post('/login', async (req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) return res.status(500).send("User not found");

    // Compare passwords
    bcrypt.compare(password, user.password, (err, result) => {
        if (err) return res.status(500).send("Error comparing passwords");

        if (result) {
            let token = jwt.sign({ email: email, userid: user._id }, "secret");
            res.cookie("token", token);
            res.status(200).redirect('/profile');
        } else {
            res.redirect('/login');
        }
    });
});

app.get('/logout', (req, res) => {
    res.cookie("token", "");
    res.render('login');
});

app.post('/post', isLoggedIn, async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Check if content is being sent correctly

        let user = await userModel.findOne({ email: req.user.email });

        if (!user) {
            return res.status(404).send('User not found');
        }

        let { content } = req.body;
        let post = await postModel.create({
            user: user._id,
            content
        });

        // Ensure `user.posts` is an array, and prevent nested arrays by using spread syntax
        user.posts = [...(user.posts || []), post._id];

        await user.save();

        res.redirect('/profile');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while creating the post');
    }
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});


