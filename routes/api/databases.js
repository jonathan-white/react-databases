const router = require("express").Router();
const databaseController = require("../../controllers/databaseController");

// Matches with "/api/databases"
router.route("/")
  .get(databaseController.findAll)
  .post(databaseController.create);

// Matches with "/api/databases/ids"
router.route("/ids")
  .get(databaseController.findAllShowIDsOnly);

// Matches with "/api/databases/:id"
router.route("/:id")
  .get(databaseController.findById)
  .put(databaseController.update)
  .delete(databaseController.remove);

// Matches with "/api/databases/:id"
router.route("/:id/add-project")
  .post(databaseController.addProject);

// Matches with "/api/databases/:id"
router.route("/:id/remove-project")
  .delete(databaseController.removeProject);

module.exports = router;
