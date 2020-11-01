var express = require('express');
var router = express.Router();

/* DB */
var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("HOME 진입");
  res.render('index', { title: 'Express' });
});

/* TEST */
router.get('/mysql/test', function (req, res) {
  console.log("TSET 진입");
  var stmt = 'SELECT NOW()';
  connection.query(stmt, function (err, result) {
  console.log(result);
  })
});

module.exports = router;
