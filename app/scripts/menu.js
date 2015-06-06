'use strict';

$(function() {
  $('#add-input').click(function() {
    var $new = $($('#input-template').html());
    $('#base').append($new);
  });
  
  $('#add-input').click();
  $('#add-input').click();
});