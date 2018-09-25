const router = require("express").Router();
const tableController = require("../../controllers/tableController");

// Matches with "/api/tables"
router.route("/")
  .post(tableController.findAll); //get

router.route("/add-table")
  .post(tableController.create);

// Matches with "/api/tables/database/:id"
router.route("/database/:id")
  .post(tableController.findByDatabase); //get

// Matches with "/api/tables/:id"
router.route("/:id")
  .post(tableController.findById) //get
  .put(tableController.update)
  .delete(tableController.remove);

module.exports = router;
