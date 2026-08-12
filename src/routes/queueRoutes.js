const express = require("express");

const router = express.Router();

const {
  createQueue,
  getQueueByVenue,
  getQueueById,
  updateQueue,
  deleteQueue,
  joinQueue,
  queueStatus,
  leaveQueue,
  serveQueue,
  skipUser,
  pauseQueue,
  resetQueue,
  getQueueStats,
} = require("../controllers/queueController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.route("/").post(protect, authorize("admin", "superadmin"), createQueue);
router.get("/:id", getQueueById);
router.route("/venue/:venueId").get(getQueueByVenue);

router
  .route("/:id")
  .put(protect, authorize("admin", "superadmin"), updateQueue)
  .delete(protect, authorize("admin", "superadmin"), deleteQueue);

router.route("/:id/join").post(protect, joinQueue);

router.route("/:id/status").get(protect, queueStatus);

router.delete("/:id/leave", protect, leaveQueue);

router.patch(
  "/:id/serve",
  protect,
  authorize("admin", "superadmin"),
  serveQueue,
);

router.patch("/:id/skip", protect, authorize("admin", "superadmin"), skipUser);

router.patch(
  "/:id/pause",
  protect,
  authorize("admin", "superadmin"),
  pauseQueue,
);

router.patch(
  "/:id/reset",
  protect,
  authorize("admin", "superadmin"),
  resetQueue,
);

router.get(
  "/:id/queueStat",
  protect,
  authorize("admin", "superadmin"),
  getQueueStats,
);

module.exports = router;
