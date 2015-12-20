'use strict'

let gulp = require('gulp')
let sass = require('gulp-sass')
let path = require('path')
let sourcemaps = require('gulp-sourcemaps')
let autoprefixer = require('gulp-autoprefixer')
let changed = require('../helpers/changed-with-deps')
let concat = require('gulp-concat')
let lazypipe = require('lazypipe')

let constants = require('../constants')
let logger = require('../../lib/logger')

let sasspipe = lazypipe()
  .pipe(function () {
    return sass()
      .on('error', sass.logError)
  })

gulp.task('sass', () => {

  var destination = path.join(constants.build.destination, 'styles')

  logger.debug('[SASS] : destination: ' + destination)

  return gulp.src('src/styles/**/*.scss')
    .pipe(changed(`.tmp/styles`), {extension: '.css'})
    .pipe(sourcemaps.init())
    .pipe(sasspipe())
    .pipe(concat('main.css'))
    .pipe(autoprefixer('last 2 version'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(destination))

})
