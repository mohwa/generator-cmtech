requirejs.config({

  "baseUrl": '',
  "waitSeconds": 8000,

  "paths": {

    // 의존성 모듈 리스트

    "angular": 'lib/external/angular/angular',

    "jquery": 'lib/external/jquery/bower_components/jquery/dist/jquery',
    // https://github.com/gabceb/jquery-browser-plugin
    "jquery.browser": 'lib/external/jquery/bower_components/jquery.browser/dist/jquery.browser.min',
    "jquery.mousewheel": 'lib/external/jquery/bower_components/jquery-mousewheel/jquery.mousewheel',
    "jquery.scrollbar": 'lib/external/jquery/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar',

    "jquery.ui": 'lib/external/jquery/bower_components/jquery-ui/jquery-ui',

    "linqjs": 'lib/external/linq/linq',

    "purl": 'lib/external/purl/purl',

    "socketio": 'lib/external/socketio/socket.io',

    "internal.common": 'lib/internal/internal.common',
    "external.common": 'lib/external/external.common',

    // website-lib  는 아래 js 를 모두 포함한다.
    // http://8dragonspoker.play.cmt-korea.com/website-lib/coreServerHub.min.js  ==> 코어 포커 허브 API만
    // http://8dragonspoker.play.cmt-korea.com/website-lib/node-webkit-client.min.js  ==> 노드 웹킷 클라이언트 라이브러리만
    // http://8dragonspoker.play.cmt-korea.com/website-lib/validationChecker.min.js ==> 유효성 체크 라이브러리 만
    "website-config": '/config/website-config',
    "website-lib": '/website-lib/website-lib.min',

    "routes": 'routes',
    "app": 'app'

  },

  "shim": {
    "angular": {
      "deps": ['jquery'],
      "exports": 'angular'
    },
    // jquery 플러그인
    "jquery.mousewheel": {
      "deps": ['jquery']
    },
    "jquery.scrollbar": {
      "deps": ['jquery']
    },
    "jquery.ui": {
      "deps": ['jquery']
    },
    "jquery.browser": {
      "deps": ['jquery']
    },
    "routes": {
      "deps": ['app']
    },

    "app": {
      "deps": [
        'angular',
        'jquery.mousewheel',
        'jquery.scrollbar',
        'jquery.ui',
        'jquery.browser',
        'external.common',
        'internal.common',
        'socketio',
        'linqjs',
        'purl'
      ],
      "exports": 'app'
    }
  }
});

define([
  'website-lib',
  'website-config',
  'socketio',
  'linqjs',
  'purl',
  'app',
  'routes'
], function(lib, config, io, linq, purl){

  // 만약 필요한 의존성 모듈이 AMD(Asynchronous Module Definition(동적 모듈 로딩)) 방식으로 로딩은 되었지만, 원하는 VO 의 propertyName 으로 할당되지않아 사용할 수 없는경우,
  // 아래와 같이 직접적으로 VO 에 특정 propertyName 로 할당하여 사용한다.

  // socket.io
  window.io = io;
  // linqJs
  window.Enumerable = linq;
  // purl
  window.purl = purl;

  angular.element(document).ready(function(e){
    angular.bootstrap(document, ['<%= env.appName %>']);
  });


}, function(err){

  console.log(err);
});
