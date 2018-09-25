const router = require("express").Router();
const fieldController = require("../../controllers/fieldController");

// Matches with "/api/fields"
router.route("/")
  .get(fieldController.findAll)
  .post(fieldController.create);

  // Matches with "/api/fields/database/:id"
  router.route("/table/:id")
    .get(fieldController.findByTable);

// Matches with "/api/fields/:id"
router.route("/:id")
  .get(fieldController.findById)
  .put(fieldController.update)
  .delete(fieldController.remove);

module.exports = router;
