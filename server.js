// Import necessary modules and setup Express app
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); // Import Mongoose

const { User, Blog, Comment } = require("./user-model");

// Connect to MongoDB using Mongoose
mongoose
  .connect(
    "mongodb+srv://pandeymrityunjay796:LMVeGbSKqPOlYdzG@blogcluster.h0vh59n.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// API to create a user
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (err) {
    console.error("Failed to create user", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// API to create a blog
app.post("/blogs", async (req, res) => {
  try {
    const { title, content } = req.body;
    const blog = await Blog.create({
      title,
      content,
      author: req.body.authorID, //The object ID of the user object
    });
    const user = await User.findById(req.body.authorID).exec();
    console.log(user);
    user.blogs.push(blog);
    await user.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error("Failed to create blog", err);
    res.status(500).json({ error: "Failed to create blog" });
  }
});

// API to create a comment
app.post("/comments", async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.create({
      content,
      user: req.body.userId,
      blog: req.body.blogId,
    });
    const user = await User.findById(req.body.userId).exec();
    user.comments.push(comment);
    await user.save();
    const blog = await Blog.findById(req.body.blogId).exec();
    blog.comments.push(comment);
    await blog.save();
    res.status(201).json(comment);
  } catch (err) {
    console.error("Failed to create comment", err);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// API to get n-th level friends of a given user
app.get("/users/:userId/level/:levelNo", async (req, res) => {
  try {
    const { userId, levelNo } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const friends = new Set(); // Using Set to avoid duplicates
    const repfriends = new Set();
    await getFriends(user, parseInt(levelNo), friends, repfriends);
    friends.delete(userId);
    for (const friendId of repfriends) {
      friends.delete(friendId);
    }
    res.json(Array.from(friends));
  } catch (err) {
    console.error("Failed to get friends", err);
    res.status(500).json({ error: "Failed to get friends" });
  }
});

// Helper function to recursively get friends of a user up to a given level
async function getFriends(user, level, friends, repfriends) {
  if (level === 0) {
    return;
  }
  if (repfriends.has(user)) {
    return;
  }
  // Get first level friends
  const comments = await Comment.find({ user: user._id }).populate("blog");
  const firstLevelFriends = new Set();
  for (const comment of comments) {
    const blog = comment.blog;
    const blogComments = await Comment.find({ blog: blog._id }).populate(
      "user"
    );
    for (const blogComment of blogComments) {
      if (blogComment.user._id.toString() !== user._id.toString()) {
        firstLevelFriends.add(blogComment.user._id.toString());
      }
    }
  }

  // Add first level friends to result set
  if (level === 1) {
    for (const friendId of firstLevelFriends) {
      friends.add(friendId);
    }
  } else {
    for (const friendId of firstLevelFriends) {
      repfriends.add(friendId);
    }
  }

  // Recursively get friends of first level friends
  for (const friendId of firstLevelFriends) {
    const friend = await User.findById(friendId);
    await getFriends(friend, level - 1, friends, repfriends);
  }
}

// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
