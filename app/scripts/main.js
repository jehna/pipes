'use strict';

function App() {
  var self = this;
  this.nodeCache = [];
  setInterval(function() {
    self.save();
  }, 5000);
}
App.prototype = {};
App.prototype.load = function(data) {
  var self = this;
  
  if (typeof data === 'undefined') {
    data = localStorage.getItem('state');
  }
  if (!data) {
    // Build a skeleton for first use
    data = {
      nodes: []
    };
  }
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }
  this.data = data;
  
  this.data.nodes.forEach(function(node) {
    self.refreshNode(node);
  });
};
App.prototype.refreshNode = function(node) {
  var $e = $('#' + node.uuid);
  
  // Create id doesn't exist
  if (!$e.length) {
    $e = $($('#' + node.type + '-template').html());
    $e.attr('id', node.uuid);
    $('#base').append($e);
    this.nodeCache[node.uuid] = node;
  }
  
  // Position correctly
  $e.css({
    top: node.position.y,
    left: node.position.x
  });
};
App.prototype.insertNode = function(type) {
  var newNode = {
    uuid: uuid.v4(),
    type: type,
    position: {
      x: 100,
      y: 100
    }
  };
  
  this.data.nodes.push(newNode);
  this.nodeCache[newNode.uuid] = newNode;
  this.refreshNode(newNode);
};
App.prototype.save = function() {
  localStorage.setItem('state', JSON.stringify(this.data));
};
App.prototype.getNodeById = function(id) {
  return this.nodeCache[id];
};


window.app = new App();

$(function() {
  app.load();
});