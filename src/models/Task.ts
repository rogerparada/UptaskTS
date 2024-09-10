import mongoose, { Document, Schema, Types } from "mongoose";

const taskStatus = {
	PENDING: "pending",
	ON_HOLD: "onHold",
	IN_PROGRESS: "inProgress",
	UNDER_REVIEW: "underReview",
	COMPLETED: "completed",
} as const;

export type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus];

export interface ITask extends Document {
	name: string;
	description: string;
	project: Types.ObjectId;
	status: TaskStatus;
}

const TaskSchema: Schema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			require: true,
		},
		description: {
			type: String,
			trim: true,
			require: true,
		},
		project: {
			type: Types.ObjectId,
			ref: "Project",
		},
		status: {
			type: String,
			enum: Object.values(taskStatus),
			default: taskStatus.PENDING,
		},
	},
	{ timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", TaskSchema);
