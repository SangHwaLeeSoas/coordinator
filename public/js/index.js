

$(document).ready(function(){

   $.ajax({
      url: '/init',
      dataType: 'json',
      type: 'POST',
      success: function(result) {
         console.log(result);
      }
   });


});