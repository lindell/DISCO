var gulp = require('gulp');
var minifyCSS = require('gulp-csso');
var webpack = require('webpack-stream');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
const clean = require('gulp-clean');
const inline = require('gulp-inline-source');
const runSequence = require('run-sequence');

gulp.task('clean', function(){
  return gulp.src('dist', {read: false})
    .pipe(clean());
});

let htmlSrc = 'src/html/*.html';
gulp.task('html', function(){
  return gulp.src(htmlSrc)
    .pipe(gulp.dest('./dist'));
});

gulp.task('html-inline', ['js', 'sass'], function(){
  return gulp.src(htmlSrc)
    .pipe(inline({
      rootpath: './dist'
    }))
    .pipe(gulp.dest('./dist'));
});

let sassSrc = 'src/sass/*.sass';
gulp.task('sass', function(){
  return gulp.src(sassSrc)
    .pipe(sass().on('error', sass.logError))
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist/css/'))
    .pipe(browserSync.stream());
});

let jsSrc = 'src/js/script.js';
gulp.task('js', function(){
  return gulp.src(jsSrc)
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/js/'));
});

let assetsSrc = 'src/assets/*';
gulp.task('assets', function(){
  return gulp.src(assetsSrc)
    .pipe(gulp.dest('dist/assets/'));
});

gulp.task('watch', ['html', 'sass', 'js', 'assets'], function(){
  browserSync.init({
    server: "./dist"
  });

  gulp.watch(htmlSrc, ['html', browserSync.reload]);
  gulp.watch(sassSrc, ['sass']);
  gulp.watch(jsSrc, ['js', browserSync.reload]);
  gulp.watch(assetsSrc, ['assets', browserSync.reload]);
});

gulp.task('compile', function(done){
  runSequence('clean', 'html-inline', done);
});

gulp.task('default', [ 'watch' ]);
