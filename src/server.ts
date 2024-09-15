import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { connectDB } from "./config/db";
import { corsConfig } from "./config/cors";
import projectRouter from "./routes/projectRoutes";

dotenv.config();

connectDB();

const app = express();
app.use(cors(corsConfig));
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/projects", projectRouter);

export default app;
