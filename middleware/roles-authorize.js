const _ = require('lodash');

module.exports = function(...authorizedRoles) {
  return function (req, res, next) {
    if (!_.find(authorizedRoles, req.user.role)) {
      res.status(403);
      res.send('Not permitted');
      return;
    }
    next();
  };
};