
define(['angular'], function(angular){

  if (!angular) return false;

  // 의존성 설정
  var app = angular.module('<%= env.appName %>', [

    // default
    'ngRoute',
    'ngCookies',
    'ngAnimate',
    'LocalStorageModule',
    'ngResource',
    'ngSanitize',
    <% if (env.isTemplateCache){ %>
    // template
    'templates-app',
    <% } %>
    // app
    // directives
    'directives.layouts',

    // services
    'services.common',
    'services.commonUI',
    'services.cookie',
    'stores.dataStorage'
  ]);


  app.run(function ($rootScope, $common) {

    $rootScope.service = {
      $common: $common
    };

    $rootScope.$off = function (name, listener) {

      var namedListeners = this.$$listeners[name];
      if (namedListeners) {
        // Loop through the array of named listeners and remove them from the array.
        for (var i = 0; i < namedListeners.length; i++) {
          if (namedListeners[i] === listener) {
            return namedListeners.splice(i, 1);
          }
        }
      }
    };

    $common.removeConsoleMethods();

  });

  return app;
});
