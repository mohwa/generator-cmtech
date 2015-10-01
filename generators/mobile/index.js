'use strict';
var fs = require('fs');
var path = require('path');
var util = require('util');
// http://underscorejs.org/
//var underscore = require('underscore');
// https://github.com/epeli/underscore.string
//var underscoreString = require("underscore.string");
var generators = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

module.exports = generators.Base.extend({

  constructor: function () {

    generators.Base.apply(this, arguments);

    this.log('modile start');
  },
  initializing: {
    init: function(){
      console.log('init');
    }
  }
});
