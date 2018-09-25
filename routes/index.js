const path = require("path");
const router = require("express").Router();
const apiRoutes = require("./api");

// Middleware
router.use("/api", apiRoutes);

// If no API routes are hit, route to index.html
router.use("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../build/index.html"));
});

module.exports = router;
