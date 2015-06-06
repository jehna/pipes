'use strict';

function App() {
  var self = this;
  this.nodeCache = [];
  this.ioCache = [];
  this.listeners = {
    refreshConnections: []
  };
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
      nodes: [],
      connections: []
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
  var self = this;
  var cachedNode = this.nodeCache[node.uuid];
  var $e = cachedNode ? cachedNode.element : $('#' + node.uuid);
  
  // Create id doesn't exist
  if (!$e.length) {
    $e = $($('#node-template').html());
    
    // Set all properties
    $e.attr('id', node.uuid);
    $e.find('h1').text(node.name);
    node.outputs.forEach(function(output) {
      var elem = $('<div />')
      .addClass('output')
      .text(output.name)
      .attr('id', output.uuid)
      .appendTo($e);
      
      self.ioCache[output.uuid] = {
        io: output,
        element: elem,
        type: 'output'
      };
    });
    node.inputs.forEach(function(input) {
      var elem = $('<div />')
      .addClass('input')
      .text(input.name)
      .attr('id', input.uuid)
      .appendTo($e);
      
      self.ioCache[input.uuid] = {
        io: input,
        element: elem,
        type: 'input'
      };
    });
    
    // Append and cache
    $('#base').append($e);
    this.nodeCache[node.uuid] = {
      node: node,
      element: $e
    };
  }
  
  // Position correctly
  $e.css({
    //top: node.position.y,
    //left: node.position.x
    transform: 'translate('+node.position.x+'px,'+node.position.y+'px)'
  });
};
App.prototype.insertNode = function(type) {
  var nodeType = App.getNodeType(type);
  
  var newNode = $.extend(nodeType, {
    uuid: uuid.v4(),
    type: type,
    position: {
      x: 100,
      y: 100
    }
  });
  
  newNode.inputs = newNode.inputs.map(function(input) {
    input.uuid = uuid.v4();
    return input;
  });
  newNode.outputs = newNode.outputs.map(function(output) {
    output.uuid = uuid.v4();
    return output;
  });
  
  this.data.nodes.push(newNode);
  this.refreshNode(newNode);
};
App.prototype.insertConnection = function(from, to) {
  var newConnection = {
    from: from.uuid,
    to: to.uuid
  };
  this.data.connections.push(newConnection);
  this.refreshConnections();
};
App.prototype.refreshConnections = function() {
  this.listeners.refreshConnections.forEach(function(fn) {
    fn();
  });
};
App.prototype.save = function() {
  localStorage.setItem('state', JSON.stringify(this.data));
};
App.prototype.getNodeById = function(id) {
  return this.nodeCache[id].node;
};
App.prototype.getIOById = function(id) {
  return this.getCachedIOById(id).io;
};
App.prototype.getCachedIOById = function(id) {
  return this.ioCache[id];
};
App.nodeTypes = {
  input: {
    link: {
      name: 'Link',
      inputs: [],
      outputs: [
        {
          name: 'Output'
        }
      ]
    }
  },
  db: {
    find: {
      name: 'DB Find',
      inputs: [
        {
          name: 'Input'
        }
      ],
      outputs: [
        {
          name: 'Success'
        },
        {
          name: 'Fail'
        }
      ]
    }
  }
};
App.getNodeType = function(nodeTypeString) {
  var split = nodeTypeString.split('.');
  var piece;
  var nodeType = App.nodeTypes;
  while((piece = split.shift()) && (nodeType = nodeType[piece])) {
  }
  if (!nodeType || !nodeType.name) {
    throw new Error('No such node type: ' + nodeTypeString);
  }
  return nodeType;
};


window.app = new App();

$(function() {
  app.load();
});