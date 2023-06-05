import dotenv from "dotenv/config";
import { MongoClient, ServerApiVersion } from "mongodb";

const URL = process.env.ATLAS_CONNECTION_STRING;

const client = new MongoClient(URL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const db = client.db("userdb");

export default {
    users: db.collection("users"),
    markers: db.collection("markers"),
    workouts: db.collection("workouts"),
    questionboard: db.collection("questionboard"),
};
