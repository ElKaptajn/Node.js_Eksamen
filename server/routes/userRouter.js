import { ObjectId } from "mongodb";
import { Router } from "express";
import bcrypt from "bcrypt";
const router = Router();

import db from "../database/connection.js";

router.get("/users", async (req, res) => {
    try {
        const foundUsers = await db.users.find().toArray();
        res.status(200).send(foundUsers);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error during fetching users.");
    }
});

router.get("/users/:id([0-9a-fA-F]{24})", async (req, res) => {
    try {
        const foundUser = await db.users.findOne({ _id: new ObjectId(req.params.id) });
        if (!foundUser) {
            return res.status(404).send("No user found.");
        }
        res.status(200).send(foundUser);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error during fetching user.");
    }
});

router.get("/users/:username", async (req, res) => {
    try {
        const foundUser = await db.users.findOne({ username: req.params.username });
        if (!foundUser) {
            return res.status(404).send("No user found.");
        }
        res.status(200).send(foundUser);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error during fetching user.");
    }
});

router.post("/users", async (req, res) => {
    if (!req.body.username || !req.body.password || !req.body.role) {
        return res.status(400).send({ message: "Missing key in the body" });
    }
    const encryptedPassword = await bcrypt.hash(req.body.password, 12);
    try {
        const createUser = await db.users.insertOne({ username: req.body.username, password: encryptedPassword, role: req.body.role });
        res.status(201).send({ message: "User created", _id: createUser.insertedId });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error during user creation.");
    }
});

router.put("/users/:id", async (req, res) => {
    if (!req.body.username || !req.body.password || !req.body.role) {
        return res.status(400).send({ message: "Missing key in the body" });
    }
    const encryptedPassword = await bcrypt.hash(req.body.password, 12);
    try {
        const updateUser = await db.users.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { username: req.body.username, password: encryptedPassword, role: req.body.role } }
        );
        if(updateUser.modifiedCount === 0){
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send({ message: "User updated" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error during user update.");
    }
});

router.delete("/users/:id", async (req, res) => {
    try {
        const deleteUser = await db.users.deleteOne({ _id: new ObjectId(req.params.id) });
        if(deleteUser.deletedCount === 0){
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send({ message: "User deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error during user deletion.");
    }
});

export default router;