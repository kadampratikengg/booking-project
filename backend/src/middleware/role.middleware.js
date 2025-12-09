const AdminUser = require('../models/AdminUser');

function requireRole(roles = []) {
  return async (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).send('Unauthorized');
    if (user.type && user.type !== 'admin')
      return res.status(403).send('Forbidden');

    // normalize user's roles: support `roles` array or single `role` string
    let userRoles = [];
    if (Array.isArray(user.roles)) userRoles = user.roles;
    else if (user.role) userRoles = [user.role];

    // If no roles on token, try to read from req.userModel or DB
    if (userRoles.length === 0) {
      if (req.userModel && req.userModel.role) userRoles = [req.userModel.role];
      else if (user.id) {
        try {
          const dbUser = await AdminUser.findById(user.id).select('role');
          if (dbUser && dbUser.role) userRoles = [dbUser.role];
        } catch (err) {
          console.error('Error fetching admin user for role check', err);
        }
      }
    }

    const normalizedUserRoles = userRoles.map((r) => String(r).toLowerCase());
    const normalizedRequired = roles.map((r) => String(r).toLowerCase());

    const ok = normalizedRequired.some((r) => normalizedUserRoles.includes(r));
    if (!ok) {
      const body = { message: 'Forbidden' };
      if (process.env.NODE_ENV !== 'production')
        body.resolvedRoles = normalizedUserRoles;
      console.warn(
        'Role check failed. Required:',
        normalizedRequired,
        'UserRoles:',
        normalizedUserRoles
      );
      return res.status(403).json(body);
    }
    next();
  };
}

module.exports = { requireRole };
