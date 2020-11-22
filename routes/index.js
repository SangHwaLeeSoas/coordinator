
var express = require('express');
var router = express.Router();
const axios = require("axios");
const cheerio = require('cheerio');

/* DB */
var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);


/* GET Index */
router.get('/', async (req, res) => {
  res.render('index', { title: 'Express' });
});

// function getUsers(){
//   var sql = 'SELECT A.USER_IDX, A.USER_NAME, A.USER_SCORE + IFNULL((SELECT SUM(SCORE) FROM USERS_HISTORY WHERE USER_IDX = A.USER_IDX), 0) AS USER_SCORE' +
//             'FROM coordinator.users A';
//   connection.query( sql, function (err, result) {
//     return result;
//   });
// }


router.post('/init', async (req, res, next) => {

  let url = 'https://www.accuweather.com/ko/kr/seoul/226081/weather-forecast/226081';

  axios.get(url).then(html => {
    console.log('====================================');
    let ulList = [];
    let $ = cheerio.load(html.data);
    let $tempList = $(".temp-container").find(".temp").text().split('°');
    console.log($tempList[0].replace(/\D/g, ''));
    console.log($tempList[1].replace(/\D/g, ''));

    let $icon = $("img.weather-icon").attr('data-src');
    console.log($icon);

    let $iconNum = $icon.split('weathericons/')[1].split('.')[0];
    console.log('$iconNum: ', $iconNum);
    let $iconData = 0;
    if(12 <= Number($iconNum) && Number($iconNum) <= 26){
      $iconData = $iconNum;
    }

    console.log('$iconData: ', $iconData);

    let $airCnt = $(".air-quality-content").find(".aq-number").text();
    console.log($airCnt.replace(/\D/g, ''));

    let $airName = $(".air-quality-data-wrapper").find(".category-text").text();
    console.log($airName);

    //json으로 변환하여 app으로 전송
    let dateList = {
      temp : $tempList[0].replace(/\D/g, ''),
      realTemp : $tempList[1].replace(/\D/g, ''),
      icon : $icon,
      iconNum : $iconData,
      airNum : $airCnt.replace(/\D/g, ''),
      airName : $airName
    };


    return res.json(dateList);
  })

});

/* 옷계산 */
router.post('/show/look', async (req, res, next) => {
  console.log('/show/look..................');

  let lookType = req.body.lookType;

  let sql = 'SELECT * FROM coordinator.look WHERE LOOK_TYPE = ? ORDER BY RAND() LIMIT 1';
  connection.query(sql, lookType, function (err, result) {
    res.json(result);

  });

});

/* 옷계산 */
router.post('/set/score', async (req, res, next) => {
  console.log('/set/score..................');

  let userIdx = req.body.userIdx;
  let userScore = req.body.userScore

  let sql = 'INSERT INTO coordinator.USERS_HISTORY(USER_IDX, SCORE) VALUES(?, ?)';
  connection.query(sql, [userIdx, userScore], function (err, result) {
    res.json({code : 200});
  });

});

// async function get1Sql(score, arr){
//   await connection.query(sql, 1, function (err, result) {
//     score += result.SCORE;
//     console.log('#1' + result.SCORE);
//     arr.push(result.LOOK_IDX);
//   });
// }

/* 회원 등록 */
router.post('/user/regist', async (req, res, next) => {
  console.log('/user/regist..................');
  let userName = req.body.userName;
  let userScore = req.body.userScore;

  var sql = 'INSERT INTO coordinator.users (USER_NAME, USER_SCORE) VALUES (?, ?)';
  connection.query(sql, [userName, userScore], function (err, result) {
  res.json({code : 200});
  });
});

/* 회원 수정 */
router.post('/user/modify', async (req, res, next) => {
  console.log('/user/modify..................');
  let userName = req.body.userName;
  let userScore = req.body.userScore;
  let userIdx = req.body.userIdx;

  console.log('=====================');
  console.log(userName);
  console.log(userScore);
  console.log(userIdx);

  var sql = 'UPDATE coordinator.users SET USER_NAME = ?, USER_SCORE = ? WHERE USER_IDX = ?';
  connection.query(sql, [userName, userScore, userIdx], function (err, result) {
    res.json({code : 200});
  });
});

/* 회원 삭제 */
router.post('/user/remove', async (req, res, next) => {
  console.log('/user/remove..................');
  let userIdx = req.body.userIdx;

  var sql = 'DELETE FROM coordinator.users WHERE USER_IDX = ?';
  connection.query(sql, [userIdx], function (err, result) {
    res.json({code : 200});
  });
});

router.post('/user/get', async (req, res, next) => {
  console.log('/user/get..................');

  var sql = 'SELECT A.USER_IDX, A.USER_NAME, A.USER_SCORE + IFNULL((SELECT SUM(SCORE) FROM coordinator.USERS_HISTORY WHERE USER_IDX = A.USER_IDX), 0) AS USER_SCORE FROM coordinator.users A';
  connection.query(sql, function (err, result) {
    console.log(err);
    res.json(result);
  });
});


/* DB TEST */
/*router.post('/mysql/test', function (req, res) {
  console.log("TSET 진입");
  var stmt = 'SELECT NOW()';
  connection.query(stmt, function (err, result) {
  console.log(result);
  })
}); */

module.exports = router;
