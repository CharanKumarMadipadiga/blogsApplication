import express from "express";
import { v4 as uuid } from "uuid";
import { runQuery, queryAll, querySingle, deleteQuery } from "../utilities/promiseResolver.utills.js";

const router = express.Router();

// User Signup
router.post("/signup", async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password) {
        return res.status(400).send("Username and password are required");
    }

    const newId = uuid();
    const createUserQuery = `INSERT INTO users (id, username, password, email) VALUES (?, ?, ?, ?)`;
    const values = [newId, username, password, email || null];

    try {
        const result = await runQuery(createUserQuery, values);
        res.status(201).json({ message: "User created successfully", userId: newId });
    } catch (err) {
        console.log(`Error inserting user: ${err.message}`);
        res.status(500).send("Failed to create user");
    }
});

// Get All Users
router.get("/users", async (req, res) => {
    const getUsersQuery = `SELECT * FROM users`;

    try {
        const usersList = await queryAll(getUsersQuery);
        res.status(200).json(usersList);
    } catch (err) {
        console.log("Error retrieving users:", err.message);
        res.status(500).json({ message: 'Error retrieving users' });
    }
});

// Get Single User by ID
router.get("/users/:id", async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).send("User ID is required");
    }

    try {
        const getUserQuery = `SELECT * FROM users WHERE id = ?`;
        const result = await querySingle(getUserQuery, [userId]);
        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(result);
    } catch (err) {
        console.log(`Error retrieving user: ${err.message}`);
        res.status(500).json({ message: 'Error retrieving user' });
    }
});

// Update User
router.put("/users/:id", async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).send("User ID is required");
    }

    const { username, password, email } = req.body;

    const getUserQuery = `SELECT * FROM users WHERE id = ?`;
    const userDetails = await querySingle(getUserQuery, [userId]);
    if (!userDetails) {
        return res.status(404).json({ message: "User not found" });
    }

    const updateUserQuery = `
        UPDATE users
        SET username = ?, password = ?, email = ?
        WHERE id = ?
    `;
    const params = [
        username || userDetails.username,
        password || userDetails.password,
        email || userDetails.email,
        userId,
    ];

    try {
        const result = await runQuery(updateUserQuery, params);
        res.status(200).json({ message: "User updated successfully", result: result });
    } catch (err) {
        console.log(`Error updating user: ${err.message}`);
        res.status(500).json({ message: 'Failed to update user' });
    }
});

// Delete User
router.delete("/users/:id", async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        return res.status(400).send("User ID is required");
    }

    const getUserQuery = `SELECT * FROM users WHERE id = ?`;
    const userDetails = await querySingle(getUserQuery, [userId]);
    if (!userDetails) {
        return res.status(404).json({ message: "User not found" });
    }

    const deleteUserQuery = `DELETE FROM users WHERE id = ?`;

    try {
        const result = await deleteQuery(deleteUserQuery, [userId]);
        res.status(200).json({ message: "User deleted successfully", result: result });
    } catch (err) {
        console.log(`Error deleting user: ${err.message}`);
        res.status(500).json({ message: 'Failed to delete user' });
    }
});

export default router;
