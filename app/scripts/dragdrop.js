'use strict';

$(function() {
  var begin;
  var $dragObj;
  var $body = $('body');
  
  var enableDrag = function(event) {
    event.preventDefault();
    
    var diff = {
      x: (event.pageX - begin.eX) + begin.tX,
      y: (event.pageY - begin.eY) + begin.tY,
    };
    
    $dragObj.css({
      left: diff.x,
      top: diff.y
    });
  };
  
  $('#base').on('mousedown mouseup', '.card', function(event) {
    event.preventDefault();
    var $t = $(this);
    $dragObj = $t;
    
    if (event.type === 'mousedown') {
      begin = {
        eX: event.pageX,
        eY: event.pageY,
        tX: $t.offset().left,
        tY: $t.offset().top
      };
      $body.on('mousemove', enableDrag);
    }
    if (event.type === 'mouseup') {
      $body.off('mousemove', enableDrag);
    }
  });
  
});