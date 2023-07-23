const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const Blog = require('./models/blog')

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");


const { checkForAuthenticationCookie } = require("./middleware/authentication");

const app = express();
const PORT = 8000;

mongoose.connect('mongodb://127.0.0.1:27017/blogify')
    .then(e => console.log("MongoDB Connected..on : mongodb://127.0.0.1:27017/blogify"))
    .catch(err => { console.log("MongoDB not connected : ", err) });


// middleware
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")))



app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({}).sort("createdAt");

    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});

app.get('/error', (req, res) => {
    res.render('error')
});


app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.listen(PORT, () => {
    console.log(`Server is started at PORT : http://localhost:${PORT}`)
});