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
    
    // Just for debugging
    data = '{"nodes":[{"name":"Link","inputs":[],"outputs":[{"name":"Output","uuid":"df6ce7f8-9faf-4eba-ab1d-07dda5101767"}],"uuid":"cf78bc2d-be43-4b0a-84fc-be1aa7e730f2","type":"input.link","position":{"x":100,"y":100}},{"name":"Redirect","inputs":[{"name":"Input","uuid":"53eb848f-9d6e-428d-a3d7-8e4651a3022d"}],"outputs":[],"uuid":"861e9934-321e-4243-b441-8f446afc0dc2","type":"output.redirect","position":{"x":1098,"y":98}},{"name":"Session","inputs":[{"name":"Input","uuid":"216c8131-783a-4f88-9de6-eca21e255011"}],"outputs":[{"name":"Output","uuid":"f2610bf9-73c9-4964-af0c-782cad37f65a"}],"uuid":"6a1550fc-4dc7-4be3-92b5-60ba6e278075","type":"modifier.session","position":{"x":800,"y":71}},{"name":"DB Find","inputs":[{"name":"Input","uuid":"1d67b168-4556-45bc-9a00-5c7228239f2e"}],"outputs":[{"name":"Success","uuid":"2c1d9217-c86c-415a-a158-d15cab991cf4"},{"name":"Fail","uuid":"196ce114-c50a-4271-ba22-0e15960f40ab"}],"uuid":"4855c8f5-d8f8-4d19-a333-7e46cc228b3d","type":"db.find","position":{"x":380,"y":60}},{"name":"Redirect","inputs":[{"name":"Input","uuid":"dc6881cd-459f-474b-aedd-523d82e5692b"}],"outputs":[],"uuid":"65c811a5-6ffc-4248-84ed-1b036f1692b0","type":"output.redirect","position":{"x":695,"y":251}}],"connections":[{"from":"f2610bf9-73c9-4964-af0c-782cad37f65a","to":"53eb848f-9d6e-428d-a3d7-8e4651a3022d"},{"from":"df6ce7f8-9faf-4eba-ab1d-07dda5101767","to":"1d67b168-4556-45bc-9a00-5c7228239f2e"},{"from":"2c1d9217-c86c-415a-a158-d15cab991cf4","to":"216c8131-783a-4f88-9de6-eca21e255011"},{"from":"196ce114-c50a-4271-ba22-0e15960f40ab","to":"dc6881cd-459f-474b-aedd-523d82e5692b"}]}';
  }
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }
  this.data = data;
  
  this.data.nodes.forEach(function(node) {
    self.refreshNode(node);
  });
  self.refreshConnections();
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
  output: {
    redirect: {
      name: 'Redirect',
      inputs: [
        {
          name: 'Input'
        }
      ],
      outputs: []
    }
  },
  modifier: {
    session: {
      name: 'Session',
      inputs: [
        {
          name: 'Input'
        }
      ],
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
  },
  other: {
    settings: {
      name: 'Settings',
      inputs: [],
      outputs: []
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