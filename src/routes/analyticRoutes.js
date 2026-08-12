const express = require("express");

const router = express.Router();

const {
  getUserHistory,
  dashboardStats,
  averageWaitTime,
  getPeakHour,
} = require("../controllers/analyticsController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.get(
  "/history",
  protect,
  /*authorize("admin", "superadmin"),*/
  getUserHistory,
);

router.get(
  "/dashboard",
  protect,
  authorize("admin", "superadmin"),
  dashboardStats,
);

router.get(
  "/:id/wait-time",
  protect,
  authorize("admin", "superadmin"),
  averageWaitTime,
);

router.get("/:id/peak", protect, authorize("admin", "superadmin"), getPeakHour);

module.exports = router;
