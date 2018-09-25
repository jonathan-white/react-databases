const router = require("express").Router();
const projectController = require("../../controllers/projectController");

// Matches with "/api/projects"
router.route("/")
  .post(projectController.findAll); //get

router.route("/add-project")
  .post(projectController.create);

// Matches with "/api/projects/database/:id"
router.route("/database/:id")
  .post(projectController.findByDatabase); //get

// Matches with "/api/projects/:id"
router.route("/:id")
  .post(projectController.findById) //get
  .put(projectController.update)
  .delete(projectController.remove);

module.exports = router;
