const router = require("express").Router();
const databaseController = require("../../controllers/databaseController");

// Matches with "/api/databases"
router.route("/")
  .post(databaseController.findAll); //get

router.route("/add-database")
  .post(databaseController.create);

// Matches with "/api/databases/ids"
router.route("/ids")
  .post(databaseController.findAllShowIDsOnly);  //get

// Matches with "/api/databases/:id"
router.route("/:id")
  .post(databaseController.findById) //get
  .put(databaseController.update)
  .delete(databaseController.remove);

// Matches with "/api/databases/:id"
router.route("/:id/add-project")
  .post(databaseController.addProject);

// Matches with "/api/databases/:id"
router.route("/:id/remove-project")
  .delete(databaseController.removeProject);

module.exports = router;
