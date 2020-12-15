'use strict';

module.exports = {
  user:     require('middleware/getters/user'),
  question: require('middleware/getters/question'),
  category: require('middleware/getters/category')
};

/*
 'use strict';

 module.exports = function isAuthenticated(req, res, next) {

 // do any checks you want to in here

 // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
 // you can do this however you want with whatever variables you set up
 if (req.user && req.user.authenticated) {
 return next();
 }
 else {
 res.redirect('/login');
 }

 };
 */