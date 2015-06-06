'use strict';

$(function() {
  var begin;
  var dragNode;
  var $body = $('body');
  
  var enableDrag = function(event) {
    event.preventDefault();
    
    var diff = {
      x: event.pageX - begin.eX,
      y: event.pageY - begin.eY,
    };
    
    dragNode.position = {
      x: diff.x + begin.tX,
      y: diff.y + begin.tY
    };
    app.refreshNode(dragNode);
    app.refreshConnections();
  };
  
  $('#base').on('mousedown mouseup', '.card', function(event) {
    event.preventDefault();
    var $t = $(this);
    dragNode = app.getNodeById($t.attr('id'));
    
    if (event.type === 'mousedown') {
      begin = {
        eX: event.pageX,
        eY: event.pageY,
        tX: dragNode.position.x,
        tY: dragNode.position.y
      };
      $body.on('mousemove', enableDrag);
    }
    if (event.type === 'mouseup') {
      $body.off('mousemove', enableDrag);
    }
  });
  
});