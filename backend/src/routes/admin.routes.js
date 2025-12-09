const router = require("express").Router();
const adminCtrl = require("../controllers/admin.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const { requireRole } = require("../middleware/role.middleware");

// -------------------- ADMIN DASHBOARD STATS --------------------
router.get(
  "/stats",
  authMiddleware,
  requireRole(["superadmin", "admin"]),
  adminCtrl.getAdminStats
);

// -------------------- DOCUMENT APPROVAL ROUTES --------------------
router.get(
  "/documents/pending",
  authMiddleware,
  requireRole(["driver-approver", "superadmin"]),
  adminCtrl.listPendingDocs
);

router.post(
  "/documents/:id",
  authMiddleware,
  requireRole(["driver-approver", "superadmin"]),
  adminCtrl.approveDocument
);

module.exports = router;
