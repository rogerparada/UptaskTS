import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.post(
	"/",
	body("projectName").notEmpty().withMessage("The project name is required"),
	body("clientName").notEmpty().withMessage("The client name is required"),
	body("description").notEmpty().withMessage("The description is required"),
	handleInputErrors,
	ProjectController.createProject
);
router.get("/", ProjectController.getAllProjects);
router.get("/:id", param("id").isMongoId().withMessage("Not valid ID"), handleInputErrors, ProjectController.getProjectByID);
router.put(
	"/:id",
	param("id").isMongoId().withMessage("Not valid ID"),
	body("projectName").notEmpty().withMessage("The project name is required"),
	body("clientName").notEmpty().withMessage("The client name is required"),
	body("description").notEmpty().withMessage("The description is required"),
	handleInputErrors,
	ProjectController.updateProject
);
router.delete("/:id", param("id").isMongoId().withMessage("Not valid ID"), handleInputErrors, ProjectController.deleteProject);

export default router;
