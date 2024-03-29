/*global require:true, module:false*/
module.exports = function (grunt) {
  'use strict';

  var appConfig = {
    root: "app",
    dist: "dist",
    publicBase: "app/public",
    sassDir: "app/views/sass",

    port: grunt.option('port') || 7770,
    hostname: "0.0.0.0",
    liveReloadPort: grunt.option('lrp') || 35729
  };

  // For livereload
  function addLiveReloadMiddleware(connect, options) {
    var path = require('path'),
      lrSnippet = require('connect-livereload')({
        port: appConfig.liveReloadPort
      }),
      folderMount = function folderMount(connect, point) {
        return connect['static'](path.resolve(point));
      };

    return [lrSnippet, folderMount(connect, options.base)];
  }

  // Load Grunt tasks declared in the package.json file
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    app: appConfig,
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

    connect: {
      livereload: {
        options: {
          hostname: '<%= app.hostname %>',
          port: '<%= app.port %>',
          base: '<%= app.publicBase %>',
          middleware: addLiveReloadMiddleware
        }
      }
    },

    sass: {
      dist: {
        files: {
          '<%= app.publicBase %>/css/main.css': '<%= app.sassDir %>/main.scss'
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: ['Gruntfile.js']
      },
      karmaConfig: {
        src: ['karma.conf.js']
      },
      js: {
        src: [
          '<%= app.publicBase %>/js/*.js',
          '<%= app.publicBase %>/js/**/*.js'
        ]
      },
      test: {
        src: ['test/unit/*.js']
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        background: true
      }
    },

    watch: {
      jshintrc: {
        files: '.jshintrc',
        tasks: ['jshint:jshintrc']
      },
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile']
      },
      scripts: {
        files: [
          '<%= jshint.js.src %>',
          '<%= app.publicBase %>/vendor/**/*'
        ],
        tasks: ['jshint'],
        options: {
          livereload: '<%= app.liveReloadPort %>'
        }
      },
      karmaConfig: {
        files: '<%= jshint.karmaConfig.src %>',
        tasks: ['jshint:karmaConfig', 'karma:unit:run']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint', 'karma:unit:run']
      },
      css: {
        files: '<%= app.sassDir %>/*.scss',
        tasks: ['sass']
      },
      html: {
        files: [
          '<%= app.publicBase %>/*.html',
          '<%= app.publicBase %>/*.htm',
          '<%= app.publicBase %>/css/*.css'
        ],
        options: {
          livereload: '<%= app.liveReloadPort %>'
        }
      }
    },

    open: {
      all: {
        path: 'http://<%= app.hostname %>:<%= app.port %>'
      }
    }
  });

  grunt.registerTask('default', ['connect', 'karma', 'watch']);

};
