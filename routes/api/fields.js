const router = require("express").Router();
const fieldController = require("../../controllers/fieldController");

// Matches with "/api/fields"
router.route("/")
  .post(fieldController.findAll); //get

router.route("/add-field")
  .post(fieldController.create);

// Matches with "/api/fields/database/:id"
router.route("/table/:id")
  .post(fieldController.findByTable); //get

// Matches with "/api/fields/:id"
router.route("/:id")
  .post(fieldController.findById) //get
  .put(fieldController.update)
  .delete(fieldController.remove);

module.exports = router;
