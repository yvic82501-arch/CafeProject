const express = require("express");

const router = express.Router();

const {
  addVenue,
  getVenue,
  updateVenue,
  deleteVenue,
} = require("../controllers/venueController");

const { protect, authorize } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(getVenue)
  .post(protect, authorize("superadmin"), addVenue);

router
  .route("/:id")
  .put(protect, authorize("superadmin"), updateVenue)
  .delete(protect, authorize("superadmin"), deleteVenue);

module.exports = router;
