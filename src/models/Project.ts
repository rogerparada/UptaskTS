import mongoose, { Document, PopulatedDoc, Schema, Types } from "mongoose";
import { ITask } from "./Task";

export interface IProject extends Document {
	projectName: string;
	clientName: string;
	description: string;
	task: PopulatedDoc<ITask & Document>[];
}
const ProjectSchema: Schema = new Schema(
	{
		projectName: { type: String, require: true, trim: true },
		clientName: { type: String, require: true, trim: true },
		description: { type: String, require: true, trim: true },
		task: [
			{
				type: Types.ObjectId,
				ref: "Task",
			},
		],
	},
	{ timestamps: true }
);

const Project = mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
