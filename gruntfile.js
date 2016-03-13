'use strict';
module.exports = function(grunt) {
  // Load all tasks
  require('load-grunt-tasks')(grunt);
  // Show elapsed time
  require('time-grunt')(grunt);

  grunt.loadNpmTasks('grunt-contrib-jshint');
  
  var jsFileList = [
    'js/src/AnimationFrameDispatch.js',
    'js/src/Vector.js',
    'js/src/Dimensions.js',
    'js/src/BackgroundStrategy.js',
    'js/src/SolidBackground.js',
    'js/src/BezierMask.js',
    'js/src/ScalableBezier.js',
    'js/src/ElementDimensions.js',
    'js/src/Layer.js',
    'js/src/TemporaryCanvas.js',
    'js/src/WaveElement.js',
    'js/src/wavy.js',
    'js/main.js',
  ];

  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'assets/js/*.js',
        '!assets/js/scripts.js',
        '!assets/js/vendor/*',
        '!assets/**/*.min.*'
      ]
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [jsFileList],
        dest: 'js/app.js',
      },
    },
    uglify: {
      dist: {
        files: {
          'js/app.min.js': 'js/app.js',
        }
      }
    },
    modernizr: {
      build: {
        devFile: 'assets/js/vendor/modernizr.js',
        outputFile: 'assets/js/vendor/modernizr.min.js',
        files: {
          'src': [
            ['assets/js/scripts.min.js'],
            ['assets/js/admin.min.js'],
            ['assets/js/program_filter.min.js'],
            ['assets/js/swiftype.min.js']
          ]
        },
        uglify: true,
        parseFiles: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-modernizr');
  grunt.loadNpmTasks('grunt-wp-assets');
  
  // // Load local tasks.
  // grunt.loadTasks('tasks');

  grunt.registerTask('build', [
      // 'jshint',
      // 'sass:build',
      // 'autoprefixer:build',
      'concat',
      'uglify',
      // 'modernizr',
    ]);

};
