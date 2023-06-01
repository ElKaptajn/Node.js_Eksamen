import { Router } from "express";
import { ObjectId } from "mongodb";
const router = Router();

import db from "../database/connection.js";

router.get("/workouts", async (req, res) => {
    try {
        const foundWorkouts = await db.workouts.find().toArray();
        res.status(200).send(foundWorkouts);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error during fetching workouts.");
    }
});

router.get("/workouts/:id([0-9a-fA-F]{24})", async (req, res) => {
    try {
        const foundWorkout = await db.workouts.findOne({ _id: ObjectId(req.params.id) });
        if (!foundWorkout) {
            return res.status(404).send("No workout found.");
        }
        res.status(200).send(foundWorkout);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error during fetching workout.");
    }
});

router.get("/workouts/:locationname", async (req, res) => {
    try {
        const foundWorkouts = await db.workouts.find({ locationname: req.params.locationname }).toArray();
        if (!foundWorkouts) {
            return res.status(404).send("No workout found.");
        }
        res.status(200).send(foundWorkouts);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error during fetching workout.");
    }
});

router.post("/workouts", async (req, res) => {
    if (!req.body.locationname || !req.body.workoutname || !req.body.rating || !req.body.exercises || !req.body.description) {
        return res.status(400).send({ message: "Missing key in the body" });
    }

    for (const exercise of req.body.exercises) {
        if (!exercise.name || !exercise.description || !exercise.sets || !exercise.reps) {
            return res.status(400).send({ message: "Missing key in the exercises" });
        }
    }

    try {
        const createWorkout = await db.workouts.insertOne(req.body);
        res.status(201).send({ message: "Workout created", _id: createWorkout.insertedId });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error during workout creation.");
    }
});

router.put("/workouts/:id([0-9a-fA-F]{24})", async (req, res) => {
    if (!req.body.locationname || !req.body.workoutname || !req.body.rating || !req.body.exercises || !req.body.description) {
        return res.status(400).send({ message: "Missing key in the body" });
    }

    for (const exercise of req.body.exercises) {
        if (!exercise.name || !exercise.description || !exercise.sets || !exercise.reps) {
            return res.status(400).send({ message: "Missing key in the exercises" });
        }
    }

    try {
        const updateWorkout = await db.workouts.updateOne({ _id: ObjectId(req.params.id) }, { $set: req.body });
        if (updateWorkout.matchedCount === 0) {
            return res.status(404).send("No workout found.");
        }
        res.status(200).send({ message: "Workout updated", _id: req.params.id });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error during workout update.");
    }
});

router.delete("/workouts/:id([0-9a-fA-F]{24})", async (req, res) => {
    try {
        const deleteWorkout = await db.workouts.deleteOne({ _id: ObjectId(req.params.id) });
        if (deleteWorkout.deletedCount === 0) {
            return res.status(404).send("No workout found.");
        }
        res.status(200).send({ message: "Workout deleted", _id: req.params.id });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error during workout deletion.");
    }
});

export default router;