const express = require("express");
const {
  predictPlant,
  getAllEncyclopedia,
  getEncyclopediaById,
  getEncyclopediaByName,
} = require("../controllers/encyclopediaController");
const fileUpload = require("../middlewares/fileUpload");
const validateFileSize = require("../middlewares/validateFileSize");

const router = express.Router();

router.post(
  "/predict",
  fileUpload.single("image"),
  validateFileSize,
  predictPlant
);
router.get("/", getAllEncyclopedia);

router.get("/name/:name", getEncyclopediaByName);

router.get("/:id", getEncyclopediaById);

// router.get("/", authMiddleware, getDiseaseHistory);
// router.delete("/:prediction_id", authMiddleware, deleteDiseaseHistory);

module.exports = router;
