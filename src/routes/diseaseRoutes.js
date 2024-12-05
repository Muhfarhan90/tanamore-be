const express = require("express");
const {
  predictDisease,
  getAllDisease,
} = require("../controllers/diseaseController");
const fileUpload = require("../middlewares/fileUpload");
const validateFileSize = require("../middlewares/validateFileSize");
// const db = require("../utils/database");
const router = express.Router();

router.post(
  "/predict",
  fileUpload.single("image"),
  validateFileSize,
  predictDisease
);

router.get("/", getAllDisease);

// router.delete("/:prediction_id", authMiddleware, deleteDiseaseHistory);

module.exports = router;
