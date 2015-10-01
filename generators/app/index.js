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

    this.argument('appRootDir', { type: String, required: true });

  },
  initializing: {

    init: function(){

      // 플랫폼 타입 정의
      this.env.options.platformTypes = [
        "desktop",
        "mobile"
      ];

      // 어플리케이션 타입 정의
      this.env.options.appTypes = [
        "poker",
        "casino"
      ];

      this.env.options.appRootDir = underscoreString(this.appRootDir).camelize().value();
    }
  },
  prompting: {

    init: function() {

      this.done = this.async();

      this.log(yosay(
        'Welcome to the luminous ' + chalk.red('CMTECH') + ' generator!'
      ));

      var prompts = [{
        type: "rawlist",
        name: 'platform',
        message: 'platform 을 설정합니다',
        choices: this.env.options.platformTypes,
        default: '1'
      }];

      this.prompt(prompts, function (props) {

        this.env.options.platform = props.platform;

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
      this.composeWith('cmtech:' + this.env.options.platform, { options: {
      }}, {
        // 의존성을 가진 sub generator 를 설정한다(일반적으로 node_modules/generator-name 패턴으로 해당 path 를 찾아가 실행한다)
        //local: require.resolve('generator-generator')
      });
    }
  },
  writing: {

  },
  conflicts: {

  },
  install: {

  },
  end: {

  }
});

