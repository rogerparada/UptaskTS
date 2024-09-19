import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";
const router = Router();

router.post(
	"/create-account",
	body("name").notEmpty().withMessage("The name cannot be empty"),
	body("password").isLength({ min: 8 }).withMessage("The password must have at least 8 characters."),
	body("password_confirmation")
		.isLength({ min: 8 })
		.withMessage("The password must have at least 8 characters.")
		.custom((value, { req }) => {
			if (value !== req.body.password_confirmation) {
				throw new Error("Passwords mismatch");
			}
			return true;
		}),
	body("email").isEmail().withMessage("E-mail not Valid"),
	handleInputErrors,
	AuthController.createAccount
);
router.post("/confirm-account", body("token").notEmpty().withMessage("The token cannot be empty"), handleInputErrors, AuthController.confirmAccount);

router.post(
	"/login",
	body("email").notEmpty().withMessage("The email cannot be empty").isEmail().withMessage("E-mail not Valid"),
	body("password").notEmpty().withMessage("The password cannot be empty"),
	handleInputErrors,
	AuthController.login
);
router.post(
	"/request-code",
	body("email").notEmpty().withMessage("The email cannot be empty").isEmail().withMessage("E-mail not Valid"),
	handleInputErrors,
	AuthController.requestConfirmationCode
);
router.post(
	"/forgot-password",
	body("email").notEmpty().withMessage("The email cannot be empty").isEmail().withMessage("E-mail not Valid"),
	handleInputErrors,
	AuthController.forgotPassword
);

router.post("/validate-token", body("token").notEmpty().withMessage("The token cannot be empty"), handleInputErrors, AuthController.validateToken);
router.post(
	"/update-password/:token",
	param("token").isNumeric().withMessage("Token not valid"),
	body("password").isLength({ min: 8 }).withMessage("The password must have at least 8 characters."),
	body("password_confirmation")
		.isLength({ min: 8 })
		.withMessage("The password must have at least 8 characters.")
		.custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error("Passwords mismatch");
			}
			return true;
		}),
	handleInputErrors,
	AuthController.updatePasswordWithToken
);

router.get("/user", authenticate, AuthController.user);

export default router;
