import { Router } from "express";
const router = Router();

import db from "../database/connection.js";

router.get('/questions', async (req, res) => {
    try {
        const foundQuestions = await db.questionboard.find().toArray();
        res.status(200).send(foundQuestions);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error during fetching markers.");
    }
  });

export default router;