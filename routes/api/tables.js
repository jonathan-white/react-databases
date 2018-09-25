const router = require("express").Router();
const tableController = require("../../controllers/tableController");

// Matches with "/api/tables"
router.route("/")
  .get(tableController.findAll)
  .post(tableController.create);

  // Matches with "/api/tables/database/:id"
  router.route("/database/:id")
    .get(tableController.findByDatabase);

// Matches with "/api/tables/:id"
router.route("/:id")
  .get(tableController.findById)
  .put(tableController.update)
  .delete(tableController.remove);

module.exports = router;
