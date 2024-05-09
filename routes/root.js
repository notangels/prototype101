const express = require('express');
const router = express.Router();
const statesRouter = require('./api/states');



router.use('/states', statesRouter);

module.exports = router;
