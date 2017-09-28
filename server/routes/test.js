var express = require('express');
var router = express.Router();

router.get('/test', function(req, res) {
  res.json({
    results: "test"
  });
});

module.exports = router;