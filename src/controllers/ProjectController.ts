import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
	static createProject = async (req: Request, res: Response) => {
		const project = new Project(req.body);
		project.manager = req.user.id;
		try {
			await project.save();
			res.send("Project Created");
		} catch (error) {
			res.status(500).json({ error: "Server Error" });
		}
	};

	static getAllProjects = async (req: Request, res: Response) => {
		try {
			const projects = await Project.find({
				$or: [{ manager: { $in: req.user.id } }, { team: { $in: req.user.id } }],
			});
			res.json(projects);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Server Error" });
		}
	};

	static getProjectByID = async (req: Request, res: Response) => {
		try {
			const { projectId } = req.params;
			const project = await Project.findById(projectId)
				.populate({ path: "tasks", populate: { path: "completedBy.user", select: "id name email" } })
				.populate({ path: "tasks", populate: { path: "notes", populate: { path: "createdBy", select: "id name email" } } });
			if (!project) {
				const error = new Error("Project not Found");
				return res.status(404).json({ error: error.message });
			}
			res.json(project);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Server Error" });
		}
	};

	static updateProject = async (req: Request, res: Response) => {
		try {
			req.project.projectName = req.body.projectName;
			req.project.clientName = req.body.clientName;
			req.project.description = req.body.description;
			req.project.save();
			res.send("Project updated");
		} catch (error) {
			res.status(500).json({ error: "Server Error" });
		}
	};

	static deleteProject = async (req: Request, res: Response) => {
		try {
			await req.project.deleteOne();
			res.send("Project deleted");
		} catch (error) {
			res.status(500).json({ error: "Server Error" });
		}
	};
}
