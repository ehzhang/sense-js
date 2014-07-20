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

router.get('/toss', function(req, res) {
  res.sendfile('examples/toss.html');
});

router.get('/color-fling', function(req, res){
  res.sendfile('examples/color_fling.html');
});

router.get('/scroll', function(req, res) {
  res.sendfile('examples/scroll.html');
});

router.get('/flip', function(req, res) {
  res.sendfile('examples/flip.html');
});
module.exports = router;
