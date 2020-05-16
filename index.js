const express = require("express"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require ("express-sanitizer"),
    mongoose = require("mongoose"),
    app = express();

//Requiring Dotenv
require('dotenv').config();

// App Config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
mongoose.connect(process.env.DATABASE_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });
//Check if We have our database connected
mongoose.connection.on("connected", () => {
    console.log("Database is connected");
});

// Mongoose model Config
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

const Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test",
//     image: "https://semantic-ui.com/images/avatar2/large/rachel.png",
//     body: "Hi this is test blog"
// });

// RESTful Routes Config
app.get("/", (req, res) => {
    res.redirect("/blogs");
});

//Index Route
app.get("/blogs", (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log("error");
        } else {
            res.render("index", { blogs: blogs });
        }
    });
});

// New ROUTE
app.get("/blogs/new", (req, res) => {
    res.render("new");
});

// Create Route
app.post("/blogs", (req, res) => {
    //Create Blog
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            res.render("new");
        } else {
            //then, redirect to index 
            res.redirect("/blogs");
        }
    });
});

// Show Route
app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show", { blog: foundBlog });
        }
    });
});

// Edit Route
app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", { blog: foundBlog });
        }
    });
});


// Update Route
app.put("/blogs/:id", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// Delete Route
app.delete("/blogs/:id", (req, res) => {
    //Destroy blog
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/blogs");
        } 
        // else {
        //     //Redirect somehwere
        //     res.redirect("/blogs");
        // }
    });
});


app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log("Server has started");
});