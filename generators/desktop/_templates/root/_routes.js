define(['app'], function (app) {

  // route 설정
  app.config([
    '$routeProvider',
    '$locationProvider',
    'localStorageServiceProvider',
    '$httpProvider', function (

      $routeProvider,
      $locationProvider,
      localStorageServiceProvider,
      $httpProvider) {

      // html5 history api 를 사용한다.
      //$locationProvider.html5Mode(false);

      // google 검색 엔진의 크롤링을 위해 #!(해시뱅) 을 사용한다.
      //$locationProvider.hashPrefix('!');

      document.title = websiteConfig.brandName;

      localStorageServiceProvider.setPrefix("<%= env.appName %>");

      if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
      }

      // IE 9 상에서 get method 호출(ajax) 시 cached 되는 문제를 위한 설정(파일의 최종 변경 시간을 변조(1997년 ~ 으로 변경) 하여 해결하였다)
      $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
      $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
      $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';


      $routeProvider.otherwise({redirectTo: '/'});

    }]);

  return app;
});
