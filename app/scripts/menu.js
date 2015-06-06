'use strict';

$(function() {
  $('#add-input').click(function() {
    app.insertNode('input.link');
  });
  $('#add-db').click(function() {
    app.insertNode('db.find');
  });
  
});