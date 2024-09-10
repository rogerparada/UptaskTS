import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import projectRouter from "./routes/projectRoutes";
import cors from "cors";
import { corsConfig } from "./config/cors";

dotenv.config();

connectDB();

const app = express();
app.use(cors(corsConfig));
app.use(express.json());
app.use("/api/projects", projectRouter);

export default app;
