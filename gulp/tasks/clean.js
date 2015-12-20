var gulp = require('gulp')
var del  = require('del')
var path = require('path')

var constants = require('../constants')

gulp.task('clean:tmp', () => {

  return del(constants.tempDir)

    .then( files => {
      return 'Cleaned files ' + files.join('\n')
    })

    .catch( e => {
      return 'Could not clean files. Error: ' + e
    })

})

gulp.task('clean:build', () => {

  return del(constants.buildDir)

          .then( files => {
            return 'Cleaned files ' + files.join('\n')
          })

          .catch( e => {
            return 'Could not clean files. Error: ' + e
          })

})

gulp.task('clean', ['clean:tmp'])
