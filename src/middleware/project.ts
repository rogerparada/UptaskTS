import type { Request, Response, NextFunction } from "express";
import Project, { IProject } from "../models/Project";

declare global {
	namespace Express {
		interface Request {
			project: IProject;
		}
	}
}

export async function projectExits(req: Request, res: Response, next: NextFunction) {
	try {
		const { projectId, id } = req.params;
		const pId = projectId ?? id;
		const project = await Project.findById(pId).populate("tasks");
		if (!project) {
			const error = new Error("Project not Found");
			return res.status(404).json({ error: error.message });
		}

		if (project.manager.toString() !== req.user.id) {
			const error = new Error("Not Valid Action");
			return res.status(404).json({ error: error.message });
		}

		req.project = project;
		next();
	} catch (error) {
		res.status(500).json({ error: "Server Error" });
	}
}
