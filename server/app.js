import dotenv from 'dotenv/config';
import { isAuthurized, isAuthenticated } from "./security/security.js"
import { ObjectId } from 'mongodb';

import express from 'express';
const app = express();

import db from "./database/connection.js";

app.use(express.json());

import helmet from 'helmet';
app.use(helmet());

import cors from "cors";
app.use(cors({
    credentials: true,
    origin: true
}));

import session from "express-session";
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

import rateLimit from 'express-rate-limit';
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(apiLimiter);

app.use("/auth", rateLimit({
	windowMs: 15 * 60 * 1000, 
	max: 100, //Change after testing is done 
	standardHeaders: true, 
	legacyHeaders: false,
}));

import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["*"],
  },
});

io.on("connection", async(socket) => {
  socket.on("question", isAuthenticated, async (data) => {
    console.log("Received question: " + data)
    const newQuestion = await db.questionboard.insertOne(data);
    io.emit("newQuestion", data);
  });

  socket.on("answer", isAuthenticated, async (data) => {
    console.log("Received answer: ", data);
    const updatedQuestion = await db.questionboard.findOneAndUpdate(
      { _id: new ObjectId(data.questionId) }, 
      { $push: { answers: data } },
      { returnOriginal: false } 
    );
    if (updatedQuestion.value) {
      io.emit("newAnswer", { user: data.user, text: data.text, questionId: data.questionId });
    }
  });
  
});

import authRouter from "./routes/authRouter.js";
app.use(authRouter);

import questionRouter from "./routes/questionRouter.js";
app.use(questionRouter);

import userRouter from "./routes/userRouter.js";
app.use(userRouter);

import markerRouter from "./routes/markerRouter.js";
app.use(markerRouter);

import workoutRouter from "./routes/workoutRouter.js";
app.use(workoutRouter);

import imageRouter from "./routes/imageRouter.js";
app.use(imageRouter);

app.get("*", (req, res) => {
  res.send("<h1>404 - Not Found</h1>")
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log("Server is running on port", server.address().port));