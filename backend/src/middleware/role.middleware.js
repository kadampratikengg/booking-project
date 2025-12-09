function requireRole(roles=[]) {
    return (req, res, next) => {
      const user = req.user;
      if (!user) return res.status(401).send('Unauthorized');
      if (user.type !== 'admin') return res.status(403).send('Forbidden');
      // user.roles is in payload?
      const userRoles = user.roles || [];
      const ok = roles.some(r => userRoles.includes(r));
      if (!ok) return res.status(403).send('Forbidden');
      next();
    };
  }
  
  module.exports = { requireRole };
  