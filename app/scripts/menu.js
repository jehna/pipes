'use strict';

$(function() {
  $('#add-input').click(function() {
    app.insertNode('input.link');
  });
  $('#add-output').click(function() {
    app.insertNode('output.redirect');
  });
  $('#add-modifier').click(function() {
    app.insertNode('modifier.session');
  });
  $('#add-db').click(function() {
    app.insertNode('db.find');
  });
  $('#add-other').click(function() {
    app.insertNode('other.settings');
  });
  
});