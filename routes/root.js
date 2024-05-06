const express = require('express');
const router = express.Router();
const statesRouter = require('./api/states');


router.use('/states', statesRouter);

// Catch-all route for 404 errors
router.use((req, res) => {
  const contentType = req.accepts('html', 'json');
  if (contentType === 'html') {
    res.status(404).send('<h1>404 Not Found</h1>');
  } else {
    res.status(404).json({ error: '404 Not Found' });
  }
});

module.exports = router;
