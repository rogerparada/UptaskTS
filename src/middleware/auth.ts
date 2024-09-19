import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

declare global {
	namespace Express {
		interface Request {
			user?: IUser;
		}
	}
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
	const bearer = req.headers.authorization;
	if (!bearer) {
		const error = new Error("Not Authenticated");
		return res.status(401).json({ error: error.message });
	}

	const token = bearer.split(" ")[1];

	try {
		const decode = jwt.verify(token, process.env.JWT_KEY);
		if (typeof decode === "object" && decode.id) {
			const user = await User.findById(decode.id);
			if (user) {
				req.user = user;
			} else {
				res.status(500).json({ error: "Token not valid" });
			}
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Token not valid" });
	}

	next();
};
