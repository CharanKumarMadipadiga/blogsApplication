import express from "express";
import { v4 as uuid } from "uuid";
import { runQuery, queryAll, querySingle, deleteQuery } from "../utilities/promiseResolver.utills.js";

const router = express.Router();

// Create Comment
router.post("/comments", async (req, res) => {
    const { post_id, author, content } = req.body;
    if (!post_id || !content) {
        return res.status(400).send("post_id and content are required");
    }

    const newId = uuid();

    const createCommentQuery = `INSERT INTO comments (id, post_id, author, content) VALUES (?, ?, ?, ?)`;
    const values = [newId, post_id, author || null, content];

    try {
        await runQuery(createCommentQuery, values);
        res.status(201).json({ message: "Comment created successfully" });
    } catch (err) {
        console.log(`Error inserting comment: ${err.message}`);
        res.status(500).send("Failed to insert comment");
    }
});

// Get All Comments
router.get("/comments", async (req, res) => {
    const getCommentsQuery = "SELECT * FROM comments";

    try {
        const commentsList = await queryAll(getCommentsQuery);
        res.status(200).json(commentsList);
    } catch (err) {
        console.log("Error retrieving the comments:", err.message);
        res.status(500).json({ message: "Error retrieving the comments" });
    }
});

// Get Single Comment
router.get("/comments/:id", async (req, res) => {
    const commentId = req.params.id;
    if (!commentId) {
        return res.status(400).send("commentId is required");
    }

    try {
        const getCommentQuery = "SELECT * FROM comments WHERE id = ?";
        const result = await querySingle(getCommentQuery, [commentId]);
        res.status(200).json(result);
    } catch (err) {
        console.log(`Error retrieving the comment: ${err.message}`);
        res.status(500).json({ message: err.message });
    }
});

// Update Comment
router.put("/comments/:id", async (req, res) => {
    const commentId = req.params.id;
    if (!commentId) {
        return res.status(400).send("commentId is required");
    }

    const getCommentQuery = "SELECT * FROM comments WHERE id = ?";
    const commentDetails = await querySingle(getCommentQuery, [commentId]);
    if (!commentDetails) {
        return res.status(400).send("Comment not found");
    }

    const { content, author } = req.body;

    const updateCommentQuery = `
        UPDATE comments
        SET content = ?, author = ?
        WHERE id = ?
    `;
    const params = [content || commentDetails.content, author || commentDetails.author, commentId];

    try {
        await runQuery(updateCommentQuery, params);
        res.status(200).json({ message: "Comment updated successfully" });
    } catch (err) {
        console.log(`Error updating comment: ${err.message}`);
        res.status(500).json({ message: "Failed to update comment" });
    }
});

// Delete Comment
router.delete("/comments/:id", async (req, res) => {
    const commentId = req.params.id;
    if (!commentId) {
        return res.status(400).send("commentId is required");
    }

    const getCommentQuery = "SELECT * FROM comments WHERE id = ?";
    const commentDetails = await querySingle(getCommentQuery, [commentId]);
    if (!commentDetails) {
        return res.status(400).send("Comment not found");
    }

    const deleteCommentQuery = "DELETE FROM comments WHERE id = ?";

    try {
        await deleteQuery(deleteCommentQuery, [commentId]);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
        console.log(`Error deleting comment: ${err.message}`);
        res.status(500).json({ message: "Failed to delete comment" });
    }
});

export default router;
