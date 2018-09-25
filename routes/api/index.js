const router = require("express").Router();
const databaseRoutes = require("./databases");
const tableRoutes = require("./tables");
const projectRoutes = require("./projects");
const fieldRoutes = require("./fields");

// middleware routes
router.use("/databases", databaseRoutes);
router.use("/tables", tableRoutes);
router.use("/projects", projectRoutes);
router.use("/fields", fieldRoutes);

module.exports = router;
