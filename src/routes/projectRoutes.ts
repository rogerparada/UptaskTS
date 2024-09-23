import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExits } from "../middleware/project";
import { hasTaskAuthorization, taskBelongToProject, taskExits } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamMemberController";
import { NoteController } from "../controllers/NoteController";

const router = Router();
router.use(authenticate);

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
	"/:projectId/tasks",
	body("name").notEmpty().withMessage("The task name is required"),
	body("description").notEmpty().withMessage("The description is required"),
	handleInputErrors,
	TaskController.createTask
);
router.get("/:projectId/tasks", TaskController.getProjectsTask);
router.get("/:projectId/tasks/:taskId", param("taskId").isMongoId().withMessage("Not valid ID"), handleInputErrors, TaskController.getTaskById);
router.put(
	"/:projectId/tasks/:taskId",
	hasTaskAuthorization,
	param("taskId").isMongoId().withMessage("Not valid ID"),
	body("name").notEmpty().withMessage("The task name is required"),
	body("description").notEmpty().withMessage("The description is required"),
	handleInputErrors,
	TaskController.updateTask
);

router.delete(
	"/:projectId/tasks/:taskId",
	hasTaskAuthorization,
	param("taskId").isMongoId().withMessage("Not valid ID"),
	handleInputErrors,
	TaskController.deleteTask
);
router.post(
	"/:projectId/tasks/:taskId/status",
	param("taskId").isMongoId().withMessage("Not valid ID"),
	body("status").notEmpty().withMessage("Status required"),
	handleInputErrors,
	TaskController.updateTaskStatus
);
// Team Routes
router.post(
	"/:projectId/team/find",
	body("email").isEmail().toLowerCase().withMessage("Not valid email"),
	handleInputErrors,
	TeamMemberController.findMemberByEmail
);
router.post("/:projectId/team", body("id").isMongoId().withMessage("Not valid id"), handleInputErrors, TeamMemberController.addMemberById);
router.get("/:projectId/team", handleInputErrors, TeamMemberController.getProjectTeam);
router.delete(
	"/:projectId/team/:userId",
	param("userId").isMongoId().withMessage("Not valid id"),
	handleInputErrors,
	TeamMemberController.removeMemberById
);

// Note Routes
router.post(
	"/:projectId/tasks/:taskId/notes",
	body("content").notEmpty().withMessage("Comment is required"),
	handleInputErrors,
	NoteController.createNote
);
router.get("/:projectId/tasks/:taskId/notes", handleInputErrors, NoteController.getTaskNotes);
router.delete(
	"/:projectId/tasks/:taskId/notes/:noteId",
	param("noteId").isMongoId().withMessage("Not valid Id"),
	handleInputErrors,
	NoteController.deleteNote
);

export default router;
