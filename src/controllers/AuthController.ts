import { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { transport } from "../config/nodemailer";
import { AuthEmail } from "../email/AuthEmail";

export class AuthController {
	static async createAccount(req: Request, res: Response) {
		try {
			const { password, email } = req.body;
			const userExist = await User.findOne({ email });
			if (userExist) {
				const error = new Error("This Email is already registered");
				return res.status(409).json({ error: error.message });
			}

			const user = new User(req.body);
			user.password = await hashPassword(password);

			const token = new Token();
			token.token = generateToken();
			token.user = user.id;

			AuthEmail.sendAuthEmail({
				email: user.email,
				name: user.name,
				token: token.token,
			});

			await Promise.allSettled([await user.save(), await token.save()]);
			return res.send("Account created. Please check your email to confirm your account");
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Server Error" });
		}
	}

	static async confirmAccount(req: Request, res: Response) {
		try {
			const { token } = req.body;
			const tokenExists = await Token.findOne({ token });
			if (!tokenExists) {
				const error = new Error("Token is  not valid");
				return res.status(404).json({ error: error.message });
			}

			const user = await User.findById(tokenExists.user);
			user.confirmed = true;
			await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

			res.send("Your account has been confirmed");
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Server Error" });
		}
	}

	static async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ email });
			if (!user) {
				const error = new Error("Email not found");
				return res.status(404).json({ error: error.message });
			}
			if (!user.confirmed) {
				const token = new Token();
				token.token = generateToken();
				token.user = user.id;

				AuthEmail.sendAuthEmail({
					email: user.email,
					name: user.name,
					token: token.token,
				});
				await token.save();
				const error = new Error("The user has not been confirmed, We've send a new confirmation email");
				return res.status(401).json({ error: error.message });
			}
			const checkPass = await checkPassword(password, user.password);
			if (!checkPass) {
				const error = new Error("The password is not correct");
				return res.status(401).json({ error: error.message });
			}
			res.send("User Login successful");
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Server Error" });
		}
	}
}
