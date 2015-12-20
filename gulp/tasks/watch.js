var gulp = require('gulp')
var constants = require('../constants')

var opts = {
  interval: 1000,
  debounceDelay: 500
}

gulp.task('watch', () => {

  gulp.watch(constants.scripts, opts, ['copy:js'])

  gulp.watch(constants.assets, opts, ['copy:assets'])

  gulp.watch(constants.styles, opts, ['sass'])

  gulp.watch(constants.pages, opts, ['pages'])

  gulp.watch(constants.blog, opts, ['blog'])

  gulp.watch(constants.posts, opts, ['posts', 'blog'])

  gulp.watch(constants.templates, opts, ['pages', 'posts', 'blog'])

})
