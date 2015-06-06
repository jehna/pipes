'use strict';

$(function() {
  
  function RetinaCanvas(ctx) {
    function applyRetinaFn(method) {
      return function() {
        var args = Array.prototype.slice.apply(arguments).map(function(arg) {
          if (typeof arg === 'number') {
            return arg * 2;
          } else {
            return arg;
          }
        });
        CanvasRenderingContext2D.prototype[method].apply(ctx, args);
      };
    }
    
    function applyRetinaValue(property) {
      return function(val) {
        if (typeof val === 'number') {
          ctx[property] = val * 2;
        } else {
          ctx[property] = val;
        }
      };
    }
    
    function getRetinaValue(property) {
      return function() {
        var val = ctx[property];
        if (typeof val === 'number') {
          return val * 2;
        } else {
          return val;
        }
      };
    }
    
    for (var p in ctx) {
      if (typeof ctx[p] === 'function') {
        this[p] = applyRetinaFn(p);
      } else {
        this.__defineSetter__(p, applyRetinaValue(p));
        this.__defineGetter__(p, getRetinaValue(p));
      }
      
    }
    
  }
  
  
  
  var $body = $('body');
  var $canvas = $('#c');
  var canvas = $canvas[0];
  var ctx = new RetinaCanvas(canvas.getContext('2d'));
  var begin;
  
  ctx.imageSmoothingEnabled = true;
  
  $canvas.attr('width', $body.width()*2);
  $canvas.attr('height', $body.height()*2);
  
  var enableDrag = function(event) {
    
    var diff = {
      x: event.pageX - begin.eX,
      y: event.pageY - begin.eY,
    };
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffcc00';
    ctx.moveTo(begin.eX,begin.eY);
    
    var point1 = {
      x: begin.eX + (diff.x * 0.5),
      y: begin.eY
    };
    
    var point2 = {
      x: begin.eX + (diff.x * 0.5),
      y: event.pageY
    };
    
    var MIN_DIFF = 50;
    if (diff.x < MIN_DIFF) {
      point1.x = begin.eX + MIN_DIFF/2 + ((diff.x-MIN_DIFF)*-0.4);
      point2.x = event.pageX - MIN_DIFF/2 + ((diff.x-MIN_DIFF)*0.4);
    }
    
    ctx.bezierCurveTo(
      point1.x, point1.y,
      point2.x, point2.y,
      event.pageX, event.pageY
    );
    ctx.stroke();
  };
  
  var INPUT = true;
  var OUTPUT = false;
  
  $('#base').on('mousedown', '.input, .output', function(event) {
    event.preventDefault();
    event.stopPropagation();
    
    var $t = $(this);
    var type = $t.is('.input') ? INPUT : OUTPUT;
    
    if (event.type === 'mousedown') {
      begin = {
        element: $t,
        eX: $t.offset().left + (type === INPUT ? -20 : ($t.width() + 20)),
        eY: $t.offset().top + 10
      };
      
      var mouseUp = function() {
        $body.off('mousemove', enableDrag);
        $body.off('mouseup', mouseUp);
      };
      
      $body.on('mousemove', enableDrag);
      $body.on('mouseup', mouseUp);
    }
    
  });
});