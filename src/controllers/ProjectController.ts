import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
	static createProject = async (req: Request, res: Response) => {
		const project = new Project(req.body);

		try {
			await project.save();
			res.send("Project Created");
		} catch (error) {
			res.status(500).json({ error: "Server Error" });
		}
	};

	static getAllProjects = async (req: Request, res: Response) => {
		try {
			const projects = await Project.find({}).populate("tasks");
			res.json(projects);
		} catch (error) {
			res.status(500).json({ error: "Server Error" });
		}
	};

	static getProjectByID = async (req: Request, res: Response) => {
		try {
			res.json(req.project);
		} catch (error) {
			res.status(500).json({ error: "Server Error" });
		}
	};

	static updateProject = async (req: Request, res: Response) => {
		try {
			req.project.projectName = req.body.projectName;
			req.project.clientName = req.body.clientName;
			req.project.description = req.body.description;
			req.project.save();
			res.json({ msg: "Project updated" });
		} catch (error) {
			res.status(500).json({ error: "Server Error" });
		}
	};

	static deleteProject = async (req: Request, res: Response) => {
		try {
			await req.project.deleteOne();
			res.json({ msg: "Project deleted" });
		} catch (error) {
			res.status(500).json({ error: "Server Error" });
		}
	};
}
