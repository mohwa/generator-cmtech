'use strict';

var child_process = require('child_process');

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  // grunt flag option
  var brand = grunt.option('brand');

  // 각 브랜드에 맞춰, 리소스 폴더의 심볼릭 링크 위치를 초기화한다.
  function initResourcesFolder() {

    var localConfig = appConfig.localConfig;

    // 만약 전달된 옵션이 없다면, 기존 링크를 유지한다.
    if (!brand) return;

    var resourcesFolder = localConfig.src.brands[String(brand)];

    if (!resourcesFolder) return;

    var commandStack = [
      'cd ./resources',
      'rm -rf css',
      'rm -rf sass',
      'rm -rf img',
      'ln -s ' + resourcesFolder + '/resources/css css',
      'ln -s ' + resourcesFolder + '/resources/sass sass',
      'ln -s ' + resourcesFolder + '/resources/img img'
    ];

    // 전달된 브랜드 옵션으로, 리소스 폴더의 심볼릭 링크 위치를 변경한다.
    cmd_exec(commandStack.join(';'), function (output) {
      console.log(output);
    });
  };

  // 전달된 경로의 JSON 파일을 읽는다.
  function readJSON(path) {

    if (grunt.file.exists(path)) {

      var ret = grunt.file.read(path);

      if (!ret) return {};

      return grunt.file.readJSON(path);
    }
    else {
      console.log(path + ' file not found.');
    }
  };

  // 전달된 커맨드 라인을 실행한다.
  function cmd_exec(cmd, cb_stdout, cb_sterror) {

    cmd = cmd || '';
    cb_stdout = cb_stdout || function () {
    };
    cb_sterror = cb_sterror || function () {
    };

    var exec = child_process.exec;

    exec(cmd, function (error, stdout, stderr) {

      cb_stdout(stdout);

      if (error !== null) {
        grunt.log.error(error);
      }
    });
  };

  var appConfig = {

    pkg: readJSON('package.json'),

    localConfig: function () {
      return readJSON('localConfig.json');
    }(),

    comment: {
      banner:
      '/*! <%%= appConfig.pkg.title || appConfig.pkg.name %> - v<%%= appConfig.pkg.version %> - <%%= grunt.template.today("yyyy-mm-dd") %>\n' +
      ' Copyright (c) <%%= grunt.template.today("YYYY") %> <%%= appConfig.pkg.author %>;\n */\n',
      footer: ''
    },
    src: {

      // 빌드 패스
      dist: 'dist',

      js: {

        app: [
          'app.js',
          'app/**/*.js',
          'common/**/*.js'
        ],
        routes: ['routes.js'],
        main: ['main.js'],
        lib: {
          internal: {
            common: [
            ]
          },
          external: {
            // angularJS 및 관련 모듈
            angular: [
              'bower_components/angular/angular.min.js',
              'bower_components/angular-animate/angular-animate.js',
              'bower_components/angular-cookies/angular-cookies.min.js',
              'bower_components/angular-loading-bar/src/loading-bar.js',
              'bower_components/ngDialog/js/ngDialog.min.js',
              'bower_components/angular-route/angular-route.min.js',
              'bower_components/angular-local-storage/dist/angular-local-storage.min.js',
              'bower_components/angular-resource/angular-resource.min.js',
              'bower_components/angular-sanitize/angular-sanitize.min.js'

            ],
            // jquery 및 관련 모듈
            jquery: [
              'bower_components/jquery/dist/jquery.js',
              'bower_components/jquery-ui/jquery-ui.js',
              'bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.js',
              'bower_components/jquery-mousewheel/jquery.mousewheel.js',
              'bower_components/jquery.browser/dist/jquery.browser.min.js'
            ],
            socketio: [
              'bower_components/socket.io-client/socket.io.js'
            ],
            require: [
              'bower_components/requirejs/require.js'
            ],
            enquire: [
              'bower_components/enquire/dist/enquire.min.js'
            ],
            matchMedia: [
              'bower_components/matchMedia/matchMedia.js',
              'bower_components/matchMedia/matchMedia.addListener.js'
            ],
            linq: [
              'bower_components/linqjs/linq.js'
            ],
            purl: [
              'bower_components/purl/purl.js'
            ],
            common: [
              'bower_components/xml2json/xml2json.js',
              'bower_components/json3/lib/json3.min.js',
              'bower_components/console.image/console.image.min.js'
            ]
          }
        }
      },
      tpl: {
        app: [
          '*.tpl.html',
          'app/**/*.tpl.html',
          'common/**/*.tpl.html'
        ]
      },
      html: [
        '*.html',
        'app/**/*.html',
        'common/**/*.html'
      ],
      manifest: 'cache.appcache',
      resources: 'resources'
    }
  };

  grunt.initConfig({

    appConfig: appConfig,

    // https://github.com/sindresorhus/grunt-shell
    shell: {
      resourcesUpdate: {
        command: [
          'cd <%%= appConfig.localConfig.src.brands.eightDragons %>',
          'svn update'
        ].join('&&')
      }
    },

    // https://github.com/gruntjs/grunt-contrib-clean
    clean: {
      brand: ['<%%= appConfig.src.resources %>/css/*'],
      production: ['<%%= appConfig.src.dist %>/*']
    },
    // https://github.com/karlgoldstein/grunt-html2js
    html2js: {
      app: {
        options: {
          base: '.',
          useStrict: true
        },
        src: '<%%= appConfig.src.tpl.app %>',
        dest: '<%%= appConfig.src.dist %>/template/template.js'
      }
    },
    // https://github.com/gruntjs/grunt-contrib-concat
    concat:{
      app: {
        options: {
          stripBanners: true,
          banner: '<%%= appConfig.comment.banner %>',
          separator: ';'
        },
        src:[
          '<%%= appConfig.src.js.app %>',
          '<%%= html2js.app.dest %>'
        ],
        dest: '<%%= appConfig.src.dist %>/app.js'
      },
      angular: {
        src: '<%%= appConfig.src.js.lib.external.angular %>',
        dest: '<%%= appConfig.src.dist %>/lib/external/angular/angular.js'
      },
      require: {
        src:'<%%= appConfig.src.js.lib.external.require %>',
        dest: '<%%= appConfig.src.dist %>/lib/external/require/require.js'
      },
      socketio: {
        src:'<%%= appConfig.src.js.lib.external.socketio %>',
        dest: '<%%= appConfig.src.dist %>/lib/external/socketio/socket.io.js'
      },
      enquire: {
        src: '<%%= appConfig.src.js.lib.external.enquire %>',
        dest: '<%%= appConfig.src.dist %>/lib/external/enquire/enquire.min.js'
      },
      matchMedia: {
        src: '<%%= appConfig.src.js.lib.external.matchMedia %>',
        dest: '<%%= appConfig.src.dist %>/lib/external/matchMedia/matchMedia.js'
      },
      linq: {
        src: '<%%= appConfig.src.js.lib.external.linq %>',
        dest: '<%%= appConfig.src.dist %>/lib/external/linq/linq.js'
      },
      purl: {
        src: '<%%= appConfig.src.js.lib.external.purl %>',
        dest: '<%%= appConfig.src.dist %>/lib/external/purl/purl.js'
      },
      internal_common: {
        src: '<%%= appConfig.src.js.lib.internal.common %>',
        dest: '<%%= appConfig.src.dist %>/lib/internal/internal.common.js'
      },
      external_common: {
        src: '<%%= appConfig.src.js.lib.external.common %>',
        dest: '<%%= appConfig.src.dist %>/lib/external/external.common.js'
      }
    },
    // https://github.com/gruntjs/grunt-contrib-uglify
    uglify: {
      options: {
        //sourceMap: true,
        mangle: false
      },
      app: {
        src: ['<%%= concat.app.dest %>'],
        dest: '<%%= concat.app.dest %>'
      },
      main: {
        src: ['<%%= appConfig.src.js.main %>'],
        dest: '<%%= appConfig.src.dist %>/<%%= appConfig.src.js.main %>'
      },
      routes: {
        src: ['<%%= appConfig.src.js.routes %>'],
        dest: '<%%= appConfig.src.dist %>/<%%= appConfig.src.js.routes %>'
      },
      angular: {
        src: ['<%%= concat.angular.dest %>'],
        dest: '<%%= concat.angular.dest %>'
      },
      jquery: {
        files: [{
          expand: true,
          cwd: '<%%= appConfig.src.dist %>/lib/external/jquery',
          src: '**/*.js',
          dest: '<%%= appConfig.src.dist %>/lib/external/jquery'
        }]
      },
      require: {
        src: ['<%%= concat.require.dest %>'],
        dest: '<%%= concat.require.dest %>'
      },
      socketio: {
        src: ['<%%= concat.socketio.dest %>'],
        dest: '<%%= concat.socketio.dest %>'
      },
      matchMedia: {
        src: ['<%%= concat.matchMedia.dest %>'],
        dest: '<%%= concat.matchMedia.dest %>'
      },
      linq: {
        src: ['<%%= concat.linq.dest %>'],
        dest: '<%%= concat.linq.dest %>'
      },
      purl: {
        src: ['<%%= concat.purl.dest %>'],
        dest: '<%%= concat.purl.dest %>'
      },
      internal_common: {
        src: ['<%%= concat.internal_common.dest %>'],
        dest: '<%%= concat.internal_common.dest %>'
      },
      external_common: {
        src: ['<%%= concat.external_common.dest %>'],
        dest: '<%%= concat.external_common.dest %>'
      }
    },
    // https://github.com/gruntjs/grunt-contrib-htmlmin
    htmlmin: {
      options: {
        collapseWhitespace: true,
        conservativeCollapse: true,
        collapseBooleanAttributes: true,
        removeComments: true,
        removeCommentsFromCDATA: true,
        removeOptionalTags: true,
        minifyCSS: true
      },
      production: {
        files: [
          {
            expand: true,
            src: "<%%= appConfig.src.html %>",
            dest: "<%%= appConfig.src.dist %>",
            filter: function(content){
              <% if (env.options.isTemplateCache) { %>
                // .tpl 파일이 아닌 순수 .html 파일만 복사시킨다.
                return !/\.+(tpl)+/g.test(content) ? true : false;
              <% }else{ %>
                return true;
              <% } %>
            }
          }
        ]
      }
    },
    //https://github.com/sindresorhus/grunt-sass
    sass: {
      dev: {
        options: {
          sourceMap: false,
          outputStyle: 'nested'
        },
        files: {
          '<%%= appConfig.src.resources %>/css/app.css': '<%%= appConfig.src.resources %>/sass/app.scss',
          '<%%= appConfig.src.resources %>/css/ie9App.css': '<%%= appConfig.src.resources %>/sass/ie9App.scss'
        }
      },
      production: {
        options: {
          sourceMap: false,
          outputStyle: 'compressed'
        },
        files: {
          '<%%= appConfig.src.resources %>/css/app.css': '<%%= appConfig.src.resources %>/sass/app.scss',
          '<%%= appConfig.src.resources %>/css/ie9App.css': '<%%= appConfig.src.resources %>/sass/ie9App.scss'
        }
      }
    },
    // https://github.com/gruntjs/grunt-contrib-copy
    copy: {
      dev: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '.',
            src: [
              '*.{ico,png}',
              '<%%= appConfig.src.resources %>/css/*.*',
              '<%%= appConfig.src.resources %>/fonts/*.*',
              '<%%= appConfig.src.resources %>/img/**/*.*',
              '<%%= appConfig.src.manifest %>',

              '<%%= appConfig.src.js.main %>',
              '<%%= appConfig.src.js.routes %>',
            ],
            dest: '<%%= appConfig.src.dist %>'
          },
          {
            expand: true,
            dot: true,
            cwd: '.',
            src: ['<%%= appConfig.src.html %>'],
            dest: '<%%= appConfig.src.dist %>',
            filter: function(content){

              <% if (env.options.isTemplateCache) { %>
                // .tpl 파일이 아닌 순수 .html 파일만 복사시킨다.
                return !/\.+(tpl)+/g.test(content) ? true : false;
              <% }else{ %>
                return true;
              <% } %>
            }
          },
          {
            expand: true,
            dot: true,
            cwd: '.',
            src: '<%%= appConfig.src.js.lib.external.jquery %>',
            dest: '<%%= appConfig.src.dist %>/lib/external/jquery'
          }
        ]
      },
      production: {
        files: [{
          expand: true,
          dot: true,
          cwd: '.',
          src: [
            '*.{ico,png}',
            '<%%= appConfig.src.resources %>/css/*.*',
            '<%%= appConfig.src.resources %>/fonts/*.*',
            '<%%= appConfig.src.resources %>/img/**/*.*'
          ],
          dest: '<%%= appConfig.src.dist %>'
        },
          {
            expand: true,
            dot: true,
            cwd: '.',
            src: '<%%= appConfig.src.js.lib.external.jquery %>',
            dest: '<%%= appConfig.src.dist %>/lib/external/jquery'
          }

        ]
      }
    },
    // https://github.com/gruntjs/grunt-contrib-watch
    watch:{
      options: {
        spawn: false
      },
      dev: {
        files:[
          // app js files
          '<%%= appConfig.src.js.app %>',
          // routes js files
          '<%%= appConfig.src.js.routes %>',
          // main js file
          '<%%= appConfig.src.js.main %>',
          // app template files
          '<%%= appConfig.src.tpl.app %>',
          // sass files
          '<%%= appConfig.src.resources %>/sass/**/*.scss',
          '<%%= appConfig.src.html %>'
        ],
        tasks:['dev']
      }
    }
    //browserSync: {
    //
    //    bsFiles: {
    //        src: [
    //            '<%%= appConfig.src.dist %>/index.html'
    //        ]
    //    },
    //    options: {
    //        watchTask: true,
    //        debugInfo: true,
    //        logConnections: true,
    //        notify: true,
    //        //server: {
    //        //    baseDir: "./"
    //        //    // sync page 에 해당 디렉토리 목록을 보여준다.
    //        //    //directory: true
    //        //},
    //        ghostMode: {
    //            scroll: true,
    //            links: true,
    //            forms: true
    //        },
    //        // external ip 를 수정한다.
    //        //host: "127.0.0.1",
    //        // sync page port 를 설정한다.
    //        //port: 80,
    //        startPath: "/poker",
    //        proxy: "x.lint.bovada.lv"
    //    }
    //}
  });


  /*===================================================================================================
   *
   * 빌드 설정 초기화
   *
   * ==================================================================================================
   */

  initResourcesFolder();


  /*===================================================================================================
   *
   * 각 상황에 따른 task 모음
   *
   * ==================================================================================================
   */
  // dev build task
  grunt.registerTask('dev', ['clean:production',
  <% if (env.options.isTemplateCache){ %>
    'html2js',
  <% } %>
  'concat', 'sass:dev', 'copy:dev']);

  // production build task
  grunt.registerTask('production', ['clean:production',
  <% if (env.options.isTemplateCache){ %>
    'html2js',
  <% } %>
  'concat', 'htmlmin', 'sass:production', 'copy:production', 'uglify']);

  // default build task
  grunt.registerTask('default', ['dev']);

};
