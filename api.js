const router = require('express').Router();
const authRouter = require('routes/auth/auth-route');
const userRouter = require('routes/user/user-route');
const questionRouter = require('routes/question/question-route');
const categoryRouter = require('routes/category/category-route');
const competitionRouter = require('routes/competition/competition-route');
const customizablePageRouter = require('routes/customizable-page/customizable-page-route');

// CORS
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Routes
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/question', questionRouter);
router.use('/category', categoryRouter);
router.use('/competition', competitionRouter);
router.use('/customizable-page', customizablePageRouter);

module.exports = router;