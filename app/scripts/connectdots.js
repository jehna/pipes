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
  var swap;
  
  ctx.imageSmoothingEnabled = true;
  
  $canvas.attr('width', $body.width()*2);
  $canvas.attr('height', $body.height()*2);
  
  var enableDrag = function(event) {
    
    var from = {
      x: begin.eX,
      y: begin.eY
    };
    
    var to = {
      x: event.pageX,
      y: event.pageY
    };
    
    if (swap) {
      var tmp = from;
      from = to;
      to = tmp;
    }
    
    var diff = {
      x: to.x - from.x,
      y: to.y - from.y,
    };
    
    ctx.clearRect(0, 0, canvas.width/2, canvas.height/2);
    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ffcc00';
    ctx.moveTo(from.x,from.y);
    
    var point1 = {
      x: from.x + (diff.x * 0.5),
      y: from.y
    };
    
    var point2 = {
      x: from.x + (diff.x * 0.5),
      y: to.y
    };
    
    var MIN_DIFF = 50;
    if (diff.x < MIN_DIFF) {
      point1.x = from.x + MIN_DIFF/2 + ((diff.x-MIN_DIFF)*-0.4);
      point2.x = to.x - MIN_DIFF/2 + ((diff.x-MIN_DIFF)*0.4);
    }
    
    ctx.bezierCurveTo(
      point1.x, point1.y,
      point2.x, point2.y,
      to.x, to.y
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
      
      swap = type === INPUT;
      
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