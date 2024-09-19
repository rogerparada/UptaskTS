import { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { transport } from "../config/nodemailer";
import { AuthEmail } from "../email/AuthEmail";
import { generateJWT } from "../utils/jwt";

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
			//res.send("User Login successful");
			return res.status(200).json(generateJWT({ id: user.id }));
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Server Error" });
		}
	}

	static async requestConfirmationCode(req: Request, res: Response) {
		try {
			const { email } = req.body;
			const user = await User.findOne({ email });
			if (!user) {
				const error = new Error("This Email is not registered");
				return res.status(404).json({ error: error.message });
			}
			if (user.confirmed) {
				const error = new Error("This User is already confirmed");
				return res.status(403).json({ error: error.message });
			}

			const token = new Token();
			token.token = generateToken();
			token.user = user.id;

			AuthEmail.sendAuthEmail({
				email: user.email,
				name: user.name,
				token: token.token,
			});

			await Promise.allSettled([await token.save()]);
			return res.send("Please check your email to confirm your account");
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Server Error" });
		}
	}

	static async forgotPassword(req: Request, res: Response) {
		try {
			const { email } = req.body;
			const user = await User.findOne({ email });
			if (!user) {
				const error = new Error("This Email is not registered");
				return res.status(404).json({ error: error.message });
			}

			const token = new Token();
			token.token = generateToken();
			token.user = user.id;
			await token.save();
			AuthEmail.sendPasswordResetToken({
				email: user.email,
				name: user.name,
				token: token.token,
			});

			return res.send("Please, check your email");
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Server Error" });
		}
	}

	static async validateToken(req: Request, res: Response) {
		try {
			const { token } = req.body;
			const tokenExists = await Token.findOne({ token });
			if (!tokenExists) {
				const error = new Error("Token is  not valid");
				return res.status(404).json({ error: error.message });
			}

			res.send("Token valid, now you can reset your password");
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Server Error" });
		}
	}
	static async updatePasswordWithToken(req: Request, res: Response) {
		try {
			const { token } = req.params;
			const { password } = req.body;
			const tokenExists = await Token.findOne({ token });
			if (!tokenExists) {
				const error = new Error("Token is  not valid");
				return res.status(404).json({ error: error.message });
			}
			const user = await User.findById(tokenExists.user);
			user.password = await hashPassword(password);

			await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

			res.send("Your password has been changed");
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Server Error" });
		}
	}

	static async user(req: Request, res: Response) {
		res.json(req.user);
	}
}
