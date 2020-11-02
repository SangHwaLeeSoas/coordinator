var express = require('express');
var router = express.Router();
const axios = require("axios");
const cheerio = require('cheerio');

/* DB */
var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);


/* GET Index */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });



});


router.post('/init', async (req, res, next) => {

  let url = 'https://www.accuweather.com/ko/kr/seoul/226081/weather-forecast/226081';

  axios.get(url).then(html => {
    console.log('====================================');
    let ulList = [];
    const $ = cheerio.load(html.data);
    const $tempList = $(".temp-container").find(".temp").text().split('°');
    console.log($tempList[0].replace(/\D/g, ''));
    console.log($tempList[1].replace(/\D/g, ''));

    const $airCnt = $(".air-quality-content").find(".aq-number").text();
    console.log($airCnt.replace(/\D/g, ''));

    const $airName = $(".air-quality-data-wrapper").find(".category-text").text();
    console.log($airName);

    //json으로 변환하여 app으로 전송
    console.log('====================================');
    return res.json(data);
  })

});


/* DB TEST */
/*router.post('/mysql/test', function (req, res) {
  console.log("TSET 진입");
  var stmt = 'SELECT NOW()';
  connection.query(stmt, function (err, result) {
  console.log(result);
  })
});*/

module.exports = router;
