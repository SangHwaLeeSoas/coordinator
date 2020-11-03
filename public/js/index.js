

$(document).ready(function(){

   $.ajax({
      url: '/init',
      dataType: 'json',
      type: 'POST',
      success: function(result) {
         console.log(result);
         $('#temp').text(result.temp + ' ℃');
         $('#realTemp').text(result.realTemp + ' ℃');
         $('#airName').text(result.airName);
         $('#icon').attr('src', 'https://www.accuweather.com' + result.icon);

         if(result.airNum){
            // TODO : 마스크 착용
         }

      }
   });


});