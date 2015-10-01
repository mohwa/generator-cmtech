'use strict';
var fs = require('fs');
var path = require('path');
var util = require('util');
// http://underscorejs.org/
var underscore = require('underscore');
// https://github.com/epeli/underscore.string
var underscoreString = require("underscore.string");
var generators = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


module.exports = generators.Base.extend({

  constructor: function () {

    generators.Base.apply(this, arguments);
  },
  initializing: {
    init: function(){
    }
  },
  prompting: {

    init: function() {

    },
    end: function(){
      //this.log('prompting end!!')
    }
  },
  configuring: {
  },
  default: {
    init: function(){
    }
  },
  writing: {

    paths: function(){

      var commonTemplatePath = this.env.options.platformTemplateRoot;
      //var destinationPath = this.destinationPath(this.env.options.appRootDir + '/trunk/src/main/webapp/');
      var destinationPath = this.destinationPath(this.env.options.appRootDir);

      // app folder
      this.spawnCommand('mkdir', [
        '-p',
        destinationPath + '/app'
      ]);

      this.fs.copyTpl(
        commonTemplatePath + '/common/',
        destinationPath + '/common',
        {
          env: this.env.options
        }
      );

      //this.spawnCommand('svn', [
      //  'checkout',
      //  '',
      //  destinationPath + '/common/services'
      //
      //]);
      //
      //this.spawnCommand('svn', [
      //  'checkout',
      //  '',
      //  destinationPath + '/common/stores'
      //
      //]);

      (function rootFiles() {

        // root folder
        this.fs.copyTpl(
          commonTemplatePath + '/root/_bower.json', destinationPath + '/bower.json',
          {
            env: this.env.options
          }
        );

        this.fs.copyTpl(
          commonTemplatePath + '/root/_package.json',
          destinationPath + '/package.json',
          {
            env: this.env.options
          }
        );

        this.fs.copyTpl(
          commonTemplatePath + '/root/_app.js',
          destinationPath + '/app.js',
          {
            env: this.env.options
          }
        );

        this.fs.copyTpl(
          commonTemplatePath + '/root/_routes.js',
          destinationPath + '/routes.js',
          {
            env: this.env.options
          }
        );

        this.fs.copyTpl(
          commonTemplatePath + '/root/_main.js',
          destinationPath + '/main.js',
          {
            env: this.env.options
          }
        );

        this.template(commonTemplatePath + '/root/_gruntfile.js', destinationPath + '/gruntfile.js');

        this.fs.copyTpl(
          commonTemplatePath + '/root/*.html',
          destinationPath + '/',
          {
            env: this.env.options
          }
        );

      }.call(this));
    }

  },
  conflicts: {

  },
  install: {

  },
  end: {

  }
});
