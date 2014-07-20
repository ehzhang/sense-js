var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.sendfile('examples/index.html');
});

router.get('/orientation', function(req, res) {
  res.sendfile('examples/orientation.html');
});

router.get('/tilt', function(req, res){
  res.sendfile('examples/tilt.html');
});

router.get('/flick', function(req, res) {
  res.sendfile('examples/flick.html');
});

router.get('/throw', function(req, res) {
  res.sendfile('examples/throw.html');
});

module.exports = router;
