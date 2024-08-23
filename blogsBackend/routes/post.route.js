import express from "express"
import {v4 as uuid} from "uuid"
// import { db } from "../db/dbConnection.js"
import { runQuery, queryAll, querySingle, deleteQuery} from "../utilities/promiseResolver.utills.js";

const router = express.Router()

//Create Post
router.post("/posts", async (req, res) => {
    const {title, content, author, image_url} = req.body
    if(!title || !content) {
        return res.status(400).send("title and content are required");
    }

    const newId = uuid()

    const createPostQuery = `INSERT INTO posts (id, title, content, author, image_url) VALUES (?, ?, ?, ?, ?)`
    const values = [newId, title, content, author || null, image_url || null];

    try {
        const result = await runQuery(createPostQuery, values)
        res.status(201).json({ message: "Post created successfully" })
    }
    catch(err) {
        console.log(`Error inserting post: ${err.message}`);
        res.status(500).send("Failed to insert post");
    }

});


//getAll Posts
router.get("/posts", async (req, res) => {

    const getPostsQuery = `SELECT * FROM posts`;

    try {
        const postsList = await queryAll(getPostsQuery)
        res.status(200).json(postsList);
    }

    catch(err) {
        console.log("Error retrieving the posts:", err.message);
        res.status(500).json({ message: 'Error retrieving the posts' });
    }
    
});


// get Single Post
router.get("/posts/:id", async (req, res) => {

    const postId = req.params.id
    if(!postId) {
        return res.status(400).send("postId is required");
    }
    
    try {
        const getPostQuery = `SELECT * FROM posts WHERE id = ?`

        const result = await querySingle(getPostQuery, [postId])
        res.status(200).json(result)
    }

    catch(err) {
        console.log(`error retrieving the post ${err.message}`)
        res.status(500).json({message: err.message})
    }
});


//update Post
router.put("/posts/:id", async (req, res) => {
    const postId = req.params.id;
    if(!postId) {
        return res.status(400).send("postId is required");
    }

    const getPostQuery = `SELECT * FROM posts WHERE id = ?`

    const postDetails = await querySingle(getPostQuery, [postId])
    if(!postDetails) {
        return res.status(400).send("Post not found");
    }

    const { title, content, author, image_url } = req.body;

    const updatePostQuery = `
        UPDATE posts
        SET title = ?, content = ?, author = ?, image_url = ?
        WHERE id = ?
    `;
    
    const params = [title || postDetails.title , content || postDetails.content, author || postDetails.author, image_url || postDetails.image_url, postId];

    try {
        const result = await runQuery(updatePostQuery, params);


        res.status(200).json({ message: "Post updated successfully", result: result });

    } catch (err) {
        console.log(`Error updating post: ${err.message}`);
        res.status(500).json({ message: 'Failed to update post' });
    }
});


//delete Post
router.delete("/posts/:id", async (req, res) => {

    const postId = req.params.id;
    if(!postId) {
        return res.status(400).send("postId is required");
    }

    const getPostQuery = `SELECT * FROM posts WHERE id = ?`

    const postDetails = await querySingle(getPostQuery, [postId])
    if(!postDetails) {
        return res.status(400).send("Post not found");
    }

    const deletePostQuery = `DELETE FROM posts WHERE id = ?`

    try {
        const result = await deleteQuery(deletePostQuery, [postId])
        res.status(200).json({ message: "Post deleted successfully", result: result });
    }

    catch(err) {
        console.log(`Error deleting post: ${err.message}`);
        res.status(500).json({ message: 'Failed to delete post' });
    }


})
    

export default router

