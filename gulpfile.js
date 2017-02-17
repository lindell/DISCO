var gulp = require('gulp');
var minifyCSS = require('gulp-csso');
var webpack = require('webpack-stream');
var browserSync = require('browser-sync').create();

let htmlSrc = 'src/html/*.html';
gulp.task('html', function(){
  return gulp.src(htmlSrc)
    .pipe(gulp.dest('./dist'));
});

let cssSrc = 'src/css/*.css';
gulp.task('css', function(){
  return gulp.src(cssSrc)
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist/css'))
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

gulp.task('watch', ['html', 'css', 'js', 'assets'], function(){
  browserSync.init({
    server: "./dist"
  });

  gulp.watch(htmlSrc, ['html', browserSync.reload]);
  gulp.watch(cssSrc, ['css']);
  gulp.watch(jsSrc, ['js', browserSync.reload]);
  gulp.watch(assetsSrc, ['assets', browserSync.reload]);
});

gulp.task('default', [ 'watch' ]);
