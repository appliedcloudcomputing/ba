var express = require('express');
var router = express.Router();

/*GET CLIENT LISTING*/
router.get('/', function(req, res) {
  res.send('respond with a resource');
});


router.get('/save', function(req, res) {
	
});

module.exports = router;