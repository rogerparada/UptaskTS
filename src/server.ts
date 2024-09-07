import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import projectRouter from "./routes/projectRoutes";

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use("/api/projects", projectRouter);

export default app;
