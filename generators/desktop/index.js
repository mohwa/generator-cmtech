'use strict';
var fs = require('fs');
var path = require('path');
var util = require('util');
// http://underscorejs.org/
var underscore = require('underscore');
// https://github.com/epeli/underscore.string
var underscoreString = require("underscore.string");
var generators = require('yeoman-generator');
var chalk = require('chalk');


module.exports = generators.Base.extend({

  constructor: function () {

    generators.Base.apply(this, arguments);
  },
  initializing: {
  },
  prompting: {

    init: function() {

      this.done = this.async();

      var prompts = [
        {
          type: "rawlist",
          name: 'appType',
          message: 'APP TYPE 을 설정합니다',
          choices: this.env.options.appTypes,
          default: '1'
        },
        {
          type: "input",
          name: 'appName',
          message: 'APP NAME 을 설정합니다',
          validate: function(appName) {

            appName = appName || '';

            var done = this.async();

            setTimeout(function() {

              if (!appName) {
                done("appName 을 넣어주십시오.");
                return;
              }

              done(true);
            });
          }
        },
        {
          type: "rawlist",
          name: 'isTemplateCache',
          message: 'TemplateCache 를 사용 유/무를 설정합니다.',
          choices: ['yes', 'no'],
          default: '1'
        }
      ];

      // 사용자 prompting 을 위해 this.prompt 메서드를 호출한다.
      this.prompt(prompts, function (props) {

        this.env.options.appType = props.appType;
        // 어플리케이션 이름
        this.env.options.appName = props.appName;
        // templateCache System 사용 유/무
        this.env.options.isTemplateCache = props.isTemplateCache === 'yes' ? true : false;

        //this.log(this.env.options.isTemplateCache);

        // 사이트 이름
        this.env.options.siteName = this.env.options.appType + '-' + this.env.options.appName;

        // platform Root Path
        this.env.options.platformRoot = __dirname;
        // platform common template Root Path
        this.env.options.platformTemplateRoot = __dirname + '/_templates';

        var o = this.env.options[this.env.options.appType] = {};

        // Site Root Path
        o.absoluteRoot = this.env.options.platformRoot + '/' + this.env.options.appType;

        //done 함수가 호출되면, 다음 task 가 진행된다.
        this.done();

      }.bind(this));
    },
    end: function(){
    }
  },
  configuring: {
  },
  default: {

    init: function(){

      // http://yeoman.io/authoring/composability.html
      this.composeWith(this.env.options.appType, { options: {
      }}, {
        local: require.resolve(this.env.options[this.env.options.appType].absoluteRoot + '/index.js')
      });
    }
  }
});

