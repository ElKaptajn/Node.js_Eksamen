import { Router } from "express";
const router = Router();

import db from "../database/connection.js";

router.get('/markers', async (req, res) => {
    try {
        const foundMarkers = await db.markers.find().toArray();
        res.status(200).send(foundMarkers);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error during fetching markers.");
    }
  });

router.get('/markers/:id([0-9a-fA-F]{24})', async (req, res) => {
    try {
        const foundMarker = await db.markers.findOne({ _id: req.params.id });
        if (!foundMarker) {
            return res.status(404).send("No marker found.");
        }
        res.status(200).send(foundMarker);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error during fetching marker.");
    }
});

router.get('/markers/name/:name', async (req, res) => {
    try {
        const foundMarker = await db.markers.findOne({ name: req.params.name });
        if (!foundMarker) {
            return res.status(404).send("No marker found.");
        }
        res.status(200).send(foundMarker);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error during fetching marker.");
    }
});

router.post('/markers',  async (req, res) => {
    if (!req.body.name || !req.body.description || !req.body.lat || !req.body.lng) {
        return res.status(400).send({ message: "Missing key in the body" });
    }

    try {
        const foundMarker = await db.markers.findOne({ name: req.body.name });
        if (foundMarker) {
            return res.status(409).send("Marker already exists.");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Error during marker creation.");
    }

    try {
        const createMarker = await db.markers.insertOne({ name: req.body.name, description: req.body.description, lat: req.body.lat, lng: req.body.lng });
        res.status(201).send({ message: "Marker created", _id: createMarker.insertedId });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error during marker creation.");
    }
});

router.put('/markers/:id', async (req, res) => {
    if (!req.body.name || !req.body.description || !req.body.lat || !req.body.lng) {
        return res.status(400).send({ message: "Missing key in the body" });
    }
    try {
        const updateMarker = await db.markers.updateOne({ _id: req.params.id }, { $set: { name: req.body.name, description: req.body.description, lat: req.body.lat, lng: req.body.lng } });
        if (updateMarker.matchedCount === 0) {
            return res.status(404).send("No marker found.");
        }
        res.status(200).send({ message: "Marker updated", _id: req.params.id });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error during marker update.");
    }
});

router.delete('/markers/:id', async (req, res) => {
    try {
        const deleteMarker = await db.markers.deleteOne({ _id: req.params.id });
        if (deleteMarker.deletedCount === 0) {
            return res.status(404).send("No marker found.");
        }
        res.status(200).send({ message: "Marker deleted", _id: req.params.id });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error during marker deletion.");
    }
});


export default router;