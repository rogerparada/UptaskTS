import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExits } from "../middleware/project";
import { taskBelongToProject, taskExits } from "../middleware/task";

const router = Router();

router.param("id", projectExits);
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

// Routes for task
router.param("projectId", projectExits);
router.param("taskId", taskExits);
router.param("taskId", taskBelongToProject);
router.post(
	"/:/task",
	body("name").notEmpty().withMessage("The task name is required"),
	body("description").notEmpty().withMessage("The description is required"),
	handleInputErrors,
	TaskController.createTask
);
router.get("/:projectId/tasks", TaskController.getProjectsTask);
router.get("/:projectId/tasks/:taskId", param("taskId").isMongoId().withMessage("Not valid ID"), handleInputErrors, TaskController.getTaskById);
router.put(
	"/:projectId/tasks/:taskId",
	param("taskId").isMongoId().withMessage("Not valid ID"),
	body("name").notEmpty().withMessage("The task name is required"),
	body("description").notEmpty().withMessage("The description is required"),
	handleInputErrors,
	TaskController.updateTask
);
router.post(
	"/:projectId/tasks/:taskId/status",
	param("taskId").isMongoId().withMessage("Not valid ID"),
	body("status").notEmpty().withMessage("Status required"),
	handleInputErrors,
	TaskController.updateTaskStatus
);

export default router;
