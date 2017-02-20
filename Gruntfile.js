module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        files: {
          'style.css' : 'style.scss'
        }
      }
    },
    watch: {
      css: {
        files: ['*.scss', '**/*.scss', '**/**/*.scss'],
        tasks: ['sass'],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['*.html', '**/*.html' ],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['*.js', '**/*.js'],
        options: {
          livereload: true
        }
      },
      php: {
        files: ["*.php", "**/*.php"],
        options: {
          livereload: true
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['watch']);
}
