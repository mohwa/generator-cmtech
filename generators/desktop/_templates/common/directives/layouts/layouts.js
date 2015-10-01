
(function(){

  var md = angular.module('directives.layouts', []);

  md.controller('headerController', [function () {
  }]);

  md.controller('footerController', [function () {

  }]);

  /*
   > @ : local scope property
   > = : bi-directional binding between local property and the parent scope property
   > & : parent scope 에서 execute expression  방법을 제공한다.
   http://mobicon.tistory.com/271
   */
  md.directive('layouts', function () {

    return {
      replace: true,
      scope: true,
      restrict: 'E',
      templateUrl: function (elem, attr) {
        return 'common/directives/layouts/' + attr.type + '.tpl.html';
      },
      compile: function (tElement, tAttr, transclude) {

        return {
          pre: function ($scope, iElement, iAttrs, controller) {
          },
          post: function ($scope, iElement, iAttrs, controller) {

          }
        };
      },
      // 해당 directive 상에서 사용될 controller 를 동적으로 할당하는 방법
      // http://stackoverflow.com/questions/15273404/name-in-angular-directive-definition
      controller: '@',
      name: 'controllerName'
    };
  });


  md.directive('viewContainer', [function () {

    var self = {

      replace: true,
      restrict: 'E',
      template: '<div></div>',
      compile: function (tElement, tAttr, transclude) {

        return {
          pre: function ($scope, iElement, iAttrs, controller) {
          },
          post: function ($scope, iElement, iAttrs, controller) {
          }
        };
      }
    };

    return self;

  }]);


  md.directive('spinner', [function () {

      return {

        replace: true,
        restrict: 'E',
        template: '<div class="spinner-layer-container"><div class="spinner-img-container"></div></div>',
        compile: function (tElement, tAttr, transclude) {

          return {
            pre: function ($scope, iElement, iAttrs, controller) {
            },
            post: function ($scope, iElement, iAttrs, controller) {
            }
          };
        }
      };

    }]
  );

  md.service('$layout', [function(){

    return {};

  }]);

}());
