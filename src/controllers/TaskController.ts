import { Request, Response } from "express";
import Project from "../models/Project";
import { Task } from "../models/Task";
import { populate } from "dotenv";

export class TaskController {
	static createTask = async (req: Request, res: Response) => {
		try {
			const task = new Task(req.body);
			task.project = req.project.id;
			req.project.tasks.push(task.id);
			await Promise.allSettled([task.save(), req.project.save()]);
			res.status(201).json("Task created");
		} catch (error) {
			res.status(500).json({ error: "Server Error" });
		}
	};

	static getProjectsTask = async (req: Request, res: Response) => {
		try {
			const tasks = await Task.find({ project: req.project.id });
			res.json({ data: tasks });
		} catch (error) {
			res.status(500).json({ error: "Server Error" });
		}
	};

	static getTaskById = async (req: Request, res: Response) => {
		try {
			const task = await Task.findById(req.task.id)
				.populate({ path: "completedBy.user", select: "id name email" })
				.populate({ path: "notes", populate: { path: "createdBy", select: "id name email" } });
			res.json(task);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Server Error" });
		}
	};

	static updateTask = async (req: Request, res: Response) => {
		try {
			req.task.name = req.body.name;
			req.task.description = req.body.description;
			req.task.save();
			res.json("Task updated");
		} catch (error) {
			res.status(500).json({ error: "Server Error" });
		}
	};

	static deleteTask = async (req: Request, res: Response) => {
		try {
			req.project.tasks = req.project.tasks.filter((task) => task.id.toString() !== req.task.id.toString());
			await Promise.allSettled([req.task.deleteOne(), req.project.save()]);
			res.json("Task deleted");
		} catch (error) {
			res.status(500).json({ error: "Server Error" });
		}
	};

	static updateTaskStatus = async (req: Request, res: Response) => {
		try {
			const { status } = req.body;
			req.task.status = status;
			const completedBy = {
				user: req.user.id,
				status,
			};
			req.task.completedBy.push(completedBy);
			await req.task.save();
			res.json("Task updated");
		} catch (error) {
			res.status(500).json({ error: "Server Error" });
		}
	};
}
