'use strict'

var jsFile = './src/js/*.js'
var jsPath = './build/js'
var cssFile = ['./src/css/*.css', './src/css/*.scss']
var cssPath = './build/css'

var gulp = require('gulp')
var concat = require('gulp-concat')
var flatten = require('gulp-flatten')
var babel = require('gulp-babel')  // 添加转换 es6  -> es5
var sass = require('gulp-sass')    // 添加转换 sass -> css
var autoprefixer = require('gulp-autoprefixer')
var runS = require('run-sequence')

gulp.task('build-js', () =>
  gulp.src(jsFile)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(flatten())
    .pipe(gulp.dest(jsPath))
)
gulp.task('build-css', () =>
  gulp.src(cssFile)
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 4 versions'],
      cascade: false
    }))
    .pipe(concat('index.css'))
    .pipe(gulp.dest(cssPath))
)

gulp.task('watch', () =>
  gulp.watch(jsFile.concat(cssFile), ['build-js', 'build-css'])
)

gulp.task('default', () =>
  runS(['build-js', 'build-css'])
)
