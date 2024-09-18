import { transport } from "../config/nodemailer";

interface IEmail {
	email: string;
	name: string;
	token: string;
}

export class AuthEmail {
	static async sendAuthEmail(user: IEmail) {
		await transport.sendMail({
			from: "UpTask <admin@uptask.com>",
			to: user.email,
			subject: "UpTask - Confirm your account",
			text: "UpTask Confirm your Account",
			html: `
            <div style="font-family: Arial, Helvetica, sans-serif; text-align: center; border: 0 1px #c8c8c8; padding: 1rem;">
                <h1 style="color: rgb(30, 30, 244)">UpTask TS</h1>
                <p>Hi ${user.name}, </p>
                <p>Your account has been created</p>
                <p>Please use this <a href="${process.env.ALLOWED_CORS}/auth/confirm-account" style="font-weight: 700; color: rgb(30, 30, 244)" href="">link</a> to confirm your account and ingress this token</p>
                <p style="font-size: 2.5rem; font-weight: 800; color: rgb(30, 30, 244);">${user.token}</p>
                <p style="font-weight: 300; color: #555">Token expires in 10 minutes</p>
            </div>`,
		});
	}
	static async sendPasswordResetToken(user: IEmail) {
		await transport.sendMail({
			from: "UpTask <admin@uptask.com>",
			to: user.email,
			subject: "UpTask - Reset your password",
			text: "UpTask Reset your password",
			html: `
            <div style="font-family: Arial, Helvetica, sans-serif; text-align: center; border: 0 1px #c8c8c8; padding: 1rem;">
                <h1 style="color: rgb(30, 30, 244)">UpTask TS</h1>
                <p>Hi ${user.name}, </p>
                <p>You request to reset your password, if not were you omit this email.</p>
                <p>Please use this <a href="${process.env.ALLOWED_CORS}/auth/new-password" style="font-weight: 700; color: rgb(30, 30, 244)" href="">link</a> and ingress this token</p>
                <p style="font-size: 2.5rem; font-weight: 800; color: rgb(30, 30, 244);">${user.token}</p>
                <p style="font-weight: 300; color: #555">Token expires in 10 minutes</p>
            </div>`,
		});
	}
}
