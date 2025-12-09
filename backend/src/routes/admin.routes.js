const router = require('express').Router();
const adminCtrl = require('../controllers/admin.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

// -------------------- ADMIN DASHBOARD STATS --------------------
router.get('/stats', authMiddleware, adminCtrl.getAdminStats);

// Create admin user (only superadmin can create other admin users)
router.post(
  '/users',
  authMiddleware,
  requireRole(['superadmin']),
  adminCtrl.createAdminUser
);

// List admin users (only superadmin)
router.get(
  '/users',
  authMiddleware,
  requireRole(['superadmin']),
  adminCtrl.listAdminUsers
);

// -------------------- DOCUMENT APPROVAL ROUTES --------------------
router.get(
  '/documents/pending',
  authMiddleware,
  requireRole(['driver-approver', 'superadmin']),
  adminCtrl.listPendingDocs
);

router.post(
  '/documents/:id',
  authMiddleware,
  requireRole(['driver-approver', 'superadmin']),
  adminCtrl.approveDocument
);

module.exports = router;
