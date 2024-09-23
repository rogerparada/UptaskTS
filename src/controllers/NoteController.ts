import type { Request, Response } from "express";
import Note, { INote } from "../models/Note";
import { Types } from "mongoose";

type NoteParams = {
	noteId: Types.ObjectId;
};

export class NoteController {
	static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
		try {
			const { content } = req.body;
			const note = new Note();
			note.content = content;
			note.createdBy = req.user.id;
			note.task = req.task.id;
			req.task.notes.push(note.id);
			await Promise.allSettled([req.task.save(), note.save()]);
			res.send("Note created");
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Server error" });
		}
	};

	static getTaskNotes = async (req: Request, res: Response) => {
		try {
			const notes = await Note.find({ task: req.task.id });
			res.json(notes);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Server error" });
		}
	};

	static deleteNote = async (req: Request<NoteParams>, res: Response) => {
		try {
			const { noteId } = req.params;
			const note = await Note.findById(noteId);
			if (!note) {
				const error = new Error("Note not found");
				return res.status(404).json({ error: error.message });
			}
			if (note.createdBy.toString() !== req.user.id) {
				const error = new Error("Not valid action");
				return res.status(401).json({ error: error.message });
			}

			req.task.notes = req.task.notes.filter((noteItem) => noteItem.toString() !== noteId.toString());

			await Promise.allSettled([req.task.save(), note.deleteOne()]);
			res.send("Note deleted");
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Server error" });
		}
	};
}
