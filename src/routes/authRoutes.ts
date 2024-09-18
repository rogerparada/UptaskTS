import { Router } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";
const router = Router();

router.post(
	"/create-account",
	body("name").notEmpty().withMessage("The name cannot be empty"),
	body("password").isLength({ min: 8 }).withMessage("The password must have at least 8 characters."),
	body("password_confirm")
		.isLength({ min: 8 })
		.withMessage("The password must have at least 8 characters.")
		.custom((value, { req }) => {
			if (value !== req.body.password_confirm) {
				throw new Error("Passwords mismatch");
			}
			return true;
		}),
	body("email").isEmail().withMessage("E-mail not Valid"),
	handleInputErrors,
	AuthController.createAccount
);
router.post("/confirm-account", body("token").notEmpty().withMessage("The token cannot be empty"), handleInputErrors, AuthController.confirmAccount);

export default router;
