var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {	
	res.render('client', { title: 'Client'});
});

module.exports = router;