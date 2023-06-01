import { Router } from "express";
const router = Router();

import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";

import db from "../database/connection.js";

router.get('/auth/verify/:token', async (req, res) => {
  const user = await db.users.findOne({ verificationToken: req.params.token });
  if (!user) {
    return res.status(400).send('Invalid verification token');
  }
  await db.users.updateOne({ _id: user._id }, { $set: { verified: true }, $unset: { verificationToken: true } });
  res.send('Your account has been verified. You can now log in.');
});

router.get("/auth/logout", (req, res) => {
    req.session.destroy(() => {
        res.status(200).send({ message: "Logout successful" });
    });
});

router.post("/auth/login", async (req, res) => {
    try {
        const row = await db.users.findOne({ username: req.body.username });
        if (!row) {
            return res.status(404).send("No user found.");
        }

        const isUserVerified = row.verified;
        if(!isUserVerified) return res.status(401).send("User not verified.");

        const isPasswordValid = await bcrypt.compare(req.body.password, row.password);
        if (!isPasswordValid) return res.status(401).send("Incorrect password.");
        req.session.user = row.username;
        req.session.role = row.role;
        res.status(200).send({ username: row.username, role: row.role });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error during password comparison.");
    }
});

router.post("/auth/register", async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const userExists = await db.users.findOne({ $or: [{ username }, { email }] });
  
    if (userExists) {
      return res.status(400).json({ error: "User already exists." });
    }
  
    const token = crypto.randomBytes(20).toString('hex');
    const user = await db.users.insertOne({ username, password: hashedPassword, role: "ROLE_USER", email, verificationToken: token, verified: false });
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_USER, 
        pass: process.env.NODEMAILER_PASS
      }
    }); 
  
    const mailOptions = {
      from: process.env.NODEMAILER_USER, 
      to: email,
      subject: 'Account Verification',
      text: `Please verify your account by clicking the following link: http://${req.headers.host}/auth/verify/${token}`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error sending verification email' });
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({ message: 'Registration successful. Please check your email.' });
      }
    });
  });

export default router;