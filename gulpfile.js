var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var utilities = require('gulp-util');
var del = require('del');
var jshint = require('gulp-jshint');
var browserSync = require('browser-sync').create();

var lib = require('bower-files')({
  "overrides":{
      "bootstrap" : {
          "main": [
            "less/bootstrap.less",
            "dist/css/bootstrap.css",
            "dist/js/bootstrap.js",
          ]
      },
      "metisMenu" : {
        "main": [
          "dist/metisMenu.css",
          "dist/metisMenu.js",
        ]
      },
      "angular-confirm" : {
        "main": [
          "angular-confirm.js"
        ]
      },
      "font-awesome" : {
        "main": [
          "css/font-awesome.css",
          "sass/font-awesome.scss",
          "less/font-awesome.less"
        ]
      },
      "angular-i18n" : {
        "main": [
          "angular-locale_es-pe.js"
        ]
      },
      "pdfjs-dist" : {
        "main": [
          "build/pdf.js",
          "build/pdf.worker.js",
        ]
      },
      "angular-pdf" : {
        "main": [
          "dist/angular-pdf.js"
        ]
      }
  }
});

var buildProduction = false;

gulp.task("serve", function(){
  browserSync.init({
    server:{
      baseDir: "./",
      index: "index.html"
    }
  });
  gulp.watch(['js/*.js'], ['jsBuild']);
  gulp.watch(['bower.json'], ['bowerBuild']);
  gulp.watch(['*.html'], ['htmlBuild']);
});

gulp.task('htmlBuild', function(){
  browserSync.reload();
});

gulp.task('bowerBuild', ['bower'], function(){
  browserSync.reload();
});

gulp.task('jsBuild', ['jsBrowserify', 'jshint'], function(){
  browserSync.reload();
});

gulp.task('bower', ['bowerJS', 'bowerCSS']);

gulp.task('bowerCSS', function(){
  return gulp.src(lib.ext('css').files)
  .pipe(concat('vendor.min.css'))
  .pipe(gulp.dest('./build/css'));
});

gulp.task('bowerJS', function () {
  return gulp.src(lib.ext('js').files)
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('./build/js'));
});

gulp.task('concatJS', function(){
  return gulp.src(['./js/*.js'])
  .pipe(concat('allJS.js'))
  .pipe(gulp.dest('./tmp'));
});

gulp.task('fonts_bootstrap', function () {
  return gulp.src('./bower_components/bootstrap/fonts/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe(gulp.dest('build/fonts/'));
});

gulp.task('fonts_awesome', function () {
  return gulp.src('./bower_components/font-awesome/fonts/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe(gulp.dest('build/fonts/'));
});

gulp.task('jsBrowserify',['concatJS'], function(){
  return browserify({ entries: ['./tmp/allJS.js'] })
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('./build/js'));
});

gulp.task('minifyScripts', ['jsBrowserify'], function(){
  return gulp.src("./build/js/app.js")
  .pipe(uglify())
  .pipe(gulp.dest('./build/js'));
});

gulp.task('clean', function(){
  return del(['build', 'tmp']);
});

gulp.task('build', ['clean', 'fonts_bootstrap', 'fonts_awesome'], function(){
  if (buildProduction){
    gulp.start('minifyScripts');
  }else{
    gulp.start('jsBrowserify');
  }
  gulp.start('bower');
});

gulp.task('jshint', function(){
  return gulp.src(['js/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});
