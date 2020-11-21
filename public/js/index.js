

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

});

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

         if(result.airNum){
            // TODO : 마스크 착용
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
                  + '<a onclick="javascript:fnViewUser($(this));" class="nav-link">'
                  + '<i class="far fa-circle nav-icon"></i>'
                  + '<p>' + result[i].USER_NAME +'</p>'
                  +  '</a></li>';
         }

         $('#userList').append(html);
      }
   });
};

var fnViewUser = function($this){

   var $li = $this.parent('li');
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