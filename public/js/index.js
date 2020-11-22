

$(document).ready(function(){
   fnInitWeather();
   fnInitUsers();


   /*회원 등록 오픈*/
   $('#registUser').on('click', function(){
      fnRegistUser();
   });

   /*회원 수정 오픈*/
   $('#modifyUser').on('click', function(){
      fnModifyUser($(this).attr('useridx'));
   });

   /*팝업종료*/
   $('.close').on('click', function(){
      $('#modal-secondary').addClass('fade').hide();
      $('#registUser').show();
      $('#modifyUser').hide();
   });

   $('#setSummer').on('click', function(){
      $('#temp').text('28  ℃');
      $('#realTemp').text('26  ℃');
      $('#maskFlag').val('1');
   });
   $('#setWinter').on('click', function(){
      $('#temp').text('-2  ℃');
      $('#realTemp').text('0  ℃');
      $('#maskFlag').val('0');
   });

   /*평가*/
   $('.checkScoreBtn').on('click', function(){
      var userIdx = $('#selectedUserIdx').val();
      var userScore = $(this).data('val');

      $.ajax({
         url: '/set/score',
         dataType: 'json',
         async : false,
         cache : false,
         data : {userIdx : userIdx, userScore : userScore},
         type: 'POST',
         success: function(res) {
            location.reload();
         }
      });

   });
});

var fnShowLook = function($this){

   $('#mainUserName').text($this.siblings('p').text());
   $('#selectedUserIdx').val($this.closest('li').data('idx'));
   var pscore = $this.closest('li').data('score');

   let tmp = parseInt($('#realTemp').text());
   let min = 0;
   let max = 0;
   var score = 0;
   var arr = [];

   // TEST
   if(tmp < 10){
      // 1 2 3 4
      let min = 10 + pscore;
      if(min <= 6)
         min = 6;
      if(min >= 8)
         min = 8;
      let max = 12 + pscore;
      if(max <= 8)
         max = 8;
      if(max >= 12)
         max = 12;

      console.log(min);
      console.log(pscore);
      console.log(max);

      for (var i = 0; i < 100; i ++){
         if(min <= score && score <= max){
            console.log(score);
            break;
         }

         score = 0;
         arr = [];

         $.ajax({
            url: '/show/look',
            dataType: 'json',
            async : false,
            cache : false,
            data : {lookType : 1},
            type: 'POST',
            success: function(res) {
               score += parseInt(res[0].SCORE);
               arr.push(res[0].LOOK_IDX);
            }
         });

         $.ajax({
            url: '/show/look',
            dataType: 'json',
            async : false,
            cache : false,
            data : {lookType : 2},
            type: 'POST',
            success: function(res) {
               score += parseInt(res[0].SCORE);
               arr.push(res[0].LOOK_IDX);
            }
         });

         $.ajax({
            url: '/show/look',
            dataType: 'json',
            async : false,
            cache : false,
            data : {lookType : 3},
            type: 'POST',
            success: function(res) {
               score += parseInt(res[0].SCORE);
               arr.push(res[0].LOOK_IDX);
            }
         });

         $.ajax({
            url: '/show/look',
            dataType: 'json',
            async : false,
            cache : false,
            data : {lookType : 4},
            type: 'POST',
            success: function(res) {
               score += parseInt(res[0].SCORE);
               arr.push(res[0].LOOK_IDX);
            }
         });

      }


   }else if(10 <= tmp && tmp < 20){
      // 1 3 4
      min = 6 + pscore;
      if(min <= 4)
         min = 4;
      if(min >= 10)
         min = 10;
      max = 10 + pscore;
      if(max <= 6)
         max = 6;
      if(max >= 12)
         max = 12;
      for (var i = 0; i < 100; i ++){
         if(min <= score && score <= max){
            console.log(score);
            break;
         }

         score = 0;
         arr = [];

         $.ajax({
            url: '/show/look',
            dataType: 'json',
            async : false,
            cache : false,
            data : {lookType : 1},
            type: 'POST',
            success: function(res) {
               score += parseInt(res[0].SCORE);
               arr.push(res[0].LOOK_IDX);
            }
         });

         $.ajax({
            url: '/show/look',
            dataType: 'json',
            async : false,
            cache : false,
            data : {lookType : 3},
            type: 'POST',
            success: function(res) {
               score += parseInt(res[0].SCORE);
               arr.push(res[0].LOOK_IDX);
            }
         });

         $.ajax({
            url: '/show/look',
            dataType: 'json',
            async : false,
            cache : false,
            data : {lookType : 4},
            type: 'POST',
            success: function(res) {
               score += parseInt(res[0].SCORE);
               arr.push(res[0].LOOK_IDX);
            }
         });

      }
   }else if(tmp >= 20){
      // 3 4
      min = 2;
      max = 6 + pscore;
      if(max <= 4)
         max = 4;
      if(max >= 10)
         max = 10;

      for (var i = 0; i < 100; i ++){
         if(min <= score && score <= max){
            console.log(score);
            break;
         }

         score = 0;
         arr = [];

         $.ajax({
            url: '/show/look',
            dataType: 'json',
            async : false,
            cache : false,
            data : {lookType : 3},
            type: 'POST',
            success: function(res) {
               score += parseInt(res[0].SCORE);
               arr.push(res[0].LOOK_IDX);
            }
         });

         $.ajax({
            url: '/show/look',
            dataType: 'json',
            async : false,
            cache : false,
            data : {lookType : 4},
            type: 'POST',
            success: function(res) {
               score += parseInt(res[0].SCORE);
               arr.push(res[0].LOOK_IDX);
            }
         });

      }
   }

   var imagesHtml = '';
   for (var i=0; i < arr.length; i++){
      imagesHtml += '<img src="/images/' + arr[i] + '.png">';
   }

   if($('#maskFlag').val() == '1')
      imagesHtml += '<img src="/images/99.jpg">';

   $('#imagesArea').html(imagesHtml);
   $('#checkBtnArea').show();
};

/* 회원 등록 */
var fnRegistUser = function(){

   var data = new Object();
   data.userName = $('#registName').val();
   data.userScore = $('input[name="r3"]:checked').val();

   $.ajax({
      url: '/user/regist',
      dataType: 'json',
      data : data,
      async : false,
      type: 'POST',
      success: function(res) {
         if(res.code == 200)
            location.reload();
      }
   });

};

/* 회원 수정 */
var fnModifyUser = function(userIdx){

   var data = new Object();
   data.userIdx = userIdx;
   data.userName = $('#registName').val();
   data.userScore = $('input[name="r3"]:checked').val();

   $.ajax({
      url: '/user/modify',
      dataType: 'json',
      data : data,
      async : false,
      type: 'POST',
      success: function(res) {
         if(res.code == 200)
            location.reload();
      }
   });

};

/* 날씨 세팅 */
var fnInitWeather = function(){

   $.ajax({
      url: '/init',
      dataType: 'json',
      type: 'POST',
      success: function(result) {
         $('#temp').text(result.temp + ' ℃');
         $('#realTemp').text(result.realTemp + ' ℃');
         $('#airName').text(result.airName);
         $('#icon').attr('src', 'https://www.accuweather.com' + result.icon);

         if(parseInt(result.airNum) > 70){
            $('#maskFlag').val(1);
         }

      }
   });
};

var fnInitUsers = function(){

   $.ajax({
      url: '/user/get',
      dataType: 'json',
      type: 'POST',
      success: function(result) {

         var html = '';

         for(var i = 0; i < result.length; i ++){
            html += '<li class="nav-item" data-idx="' + result[i].USER_IDX + '" data-score="' + result[i].USER_SCORE + '"' + '>'
                  + '<a class="nav-link">'
                  + '<i class="far fa-circle nav-icon selectLook" onclick="javscript:fnShowLook($(this));"></i>'
                  + '<p onclick="javascript:fnViewUser($(this));">' + result[i].USER_NAME +'</p>'
                  +  '</a></li>';
         }

         $('#userList').append(html);
      }
   });
};

var fnViewUser = function($this){

   var $li = $this.closest('li');
   var userIdx = $li.data('idx');
   var userScore = $li.data('score');
   var userName = $li.find('p').text();

   console.log(userIdx);
   console.log(userScore);
   console.log(userName);

   $('#registName').val(userName);
   $('input[name="r3"]').each(function(){
      if($(this).val() == userScore){
         $(this).prop('checked', true);
      }
   });

   $('#modal-secondary').removeClass('fade').show();
   $('#registUser').hide();
   $('#modifyUser').show().attr('userIdx', userIdx);
};