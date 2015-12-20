var gulp = require('gulp')
var path = require('path')
var constants = require('../constants')
var changed = require('../helpers/changed-with-deps')
var logger = require('../../lib/logger')

gulp.task('copy:js', () => {


  var destination = path.join(constants.build.destination, 'scripts')
  logger.debug('[COPY:JS] : destination: ', destination)

  gulp

    .src(constants.scripts)

    .pipe(changed(destination))

    .pipe(gulp.dest(destination))

})


gulp.task('copy:assets', () => {

  var destination = path.join(constants.build.destination, 'assets')
  logger.debug('[COPY:ASSETS] : destination: ', destination)

  gulp

    .src(constants.assets)

    .pipe(changed(destination))

    .pipe(gulp.dest(destination))

})

gulp.task('copy', ['copy:js', 'copy:assets'])


//gulp.watch(['src/assets/**/*.*'], ['copy:assets'])