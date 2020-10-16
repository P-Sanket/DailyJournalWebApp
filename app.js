//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash")
const mongoose = require('mongoose');

const homeStartingContent = "Welcome, composing is just a click away!"
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//DB Stuff
mongoose.connect("mongodb+srv://dbAdmin:Vp595nRHGcAYO7AB@learningcluster.jwqrf.mongodb.net/blogsDB?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

const postSchema = {
	postTitle: String,
	postBody: String,
}

const Post = new mongoose.model("Post", postSchema);

//Routing Stuff
app.get("/", function (req, res) {
	Post.find({}, function (error, posts) {
		res.render("home", {
			homeStartingContent: homeStartingContent,
			posts: posts
		});
	});
});

app.get("/compose", function (req, res) {
	res.render("compose");
});

app.get("/posts/:postId", function (req, res) {
	Post.findOne({ _id: req.params.postId }, function (err, post) {
		res.render("post", {
			post
		});
	});
});

app.post("/compose", function (req, res) {
	const postItem = new Post({
		postTitle: req.body.postTitle,
		postBody: req.body.postBody
	})
	postItem.save(err => {
		if (!err) {
			res.redirect("/");
		}
	});
});

app.listen(3000, function () {
	console.log("Server started on port 3000");
});
