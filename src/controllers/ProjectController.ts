import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
	static createProject = async (req: Request, res: Response) => {
		const project = new Project(req.body);

		try {
			await project.save();
			res.send("Project Created");
		} catch (error) {
			console.log(error);
		}
	};

	static getAllProjects = async (req: Request, res: Response) => {
		try {
			const projects = await Project.find({});
			res.json(projects);
		} catch (error) {
			console.log(error);
		}
	};

	static getProjectByID = async (req: Request, res: Response) => {
		try {
			res.json(req.project);
		} catch (error) {
			console.log(error);
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
			console.log(error);
		}
	};

	static deleteProject = async (req: Request, res: Response) => {
		try {
			await req.project.deleteOne();
			res.json({ msg: "Project deleted" });
		} catch (error) {
			console.log(error);
		}
	};
}
