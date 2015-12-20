/***
 * The site generated consists of a number of pages and a blog.
 *
 * The blog template is in src/blog/index.js and is handled separately, due
 * to its customized behavior
 *
 * The pages on the other hand are very straightforward compiled by the
 * Jade compiler with environment/build variables from 'environment.js'
 * provided as locals
 *
 * Pages are only compiled if the source file is newer than the destination
 * or if anything in the src/templates directories is newer
 * than the destination file
 *
 * @type {Gulp|*|exports|module.exports}
 */
// Gulp
var gulp = require('gulp')

// Gulp Plugins
var jade = require('gulp-jade')

// Node Packages

// Local packages
var changed = require('../helpers/changed-with-deps')
var constants = require('../constants')
var logger = require('../../lib/logger')


gulp.task('pages', () => {

  var destination = constants.build.destination

  logger.debug('[PAGES] : destination: ' + destination)

  // Get all jade files in the src/pages and subdirectories
  gulp.src(constants.pages)

    // forward only changed files or if we've altered templates
    .pipe(changed(destination, {
      extension: '.html',
      deps: [constants.templates]
    }))

    // compile, passing in export value from `environment.js` as locals
    // also, we need to define a `basedir` because we use absolute addressing
    // in `extends` clauses in the jade templates
    .pipe(jade({
      pretty: true,
      basedir: './'
    }))

    .pipe(gulp.dest(destination))

})


