/**
 * This helper function is just used to generate a customized version of gulp-changed,
 * where we create a hasChanged function that compares not only the time of the source/destination
 * files but also the dependencies/destination files as well - and forwards the file if the source file, or
 * dependencies have changed .
 */
'use strict'

var fs = require('fs')
var glob = require('glob')
var async = require('async')
var changed = require('gulp-changed')
var logger = require('../../lib/logger')
var util = require('util')
var gutil = require('gulp-util')
var _ = require('lodash')


// copied straight out of gulp-changed.  Handles error from fs.stat of TARGET file
// if the error is just 'ENONENT', continue on. Otherwise, emit an error on the stream.
function fsOperationFailed(stream, sourceFile, err) {
  if (err) {
    if (err.code !== 'ENOENT') {
      stream.emit('error', new gutil.PluginError('gulp-changed', err, {
        fileName: sourceFile.path
      }));
    }
    // target is non-existent, carry on
    stream.push(sourceFile);
  }
  return err;
}

// async.map iterator used to asynchronosly map each file in an array to its fs.stat result
// used in this case to get the fs.stat of all the files contained in the globs of dependencies
function globToFileStats(item, cb) {

  glob(item, function (err, files) {
    logger.debug('glob of files: ', files)
    async.map(files, fs.stat, function (err, res) {
      cb(err, res)
    })
  })

}

// FACT: rewrite this fugly function
// Given an array of arrays of fs.stat structures, finds the one that has the most
// recent .mtime.
// Subsequently, in `changeWithDeps` function, if this .mtime is more recent than the
// source .mtime, then the source is passed on through the stream as changed, otherwise,
// it is deemed unchanged.
function findNewest(stats) {
  var newest;
  function walk(array) {
    array.forEach(item => {
      if (Array.isArray(item)) {
        walk(item)
      } else {
        //logger.debug('ino: ', item.ino, 'mtime: ', item.mtime)
        if (!newest) newest = item
        else {
          newest = (item.mtime > newest.mtime) ? item : newest
        }
      }
    })
  }
  walk(stats)
  return newest
}


// returns a function that can be used in the 'hasChanged' field of the options passed to
// gulp-changed.  It si simliar to changed.compareLastModifiedTime, except that it fetches the
// mtime of all the dependencies in the 'deps' glob array and tests whether the source file is newer,
// not only than its own transformed version, but also its dependencies - (checks dependency source .mtime
// only, not any transformed version, as this does not make any sense for e.g. Jade partials and includes
// which are never compiled on their own.)
function injectDependencies(deps) {

  return function changeWithDeps(stream, cb, sourceFile, targetPath) {

    async

      .map(deps, globToFileStats, function (err, stats) {

        if (err) throw new gutil.PluginError('gulp-changed-with-deps', 'Cannot find dependencies.')

        // At this point, stats is an array that is has the same length as the 'opts.deps' passed into
        // the exported factory (module.exports below).  Each element in the array is also an array with
        // a length corresponding to the number of files in the corresponding glob
        var newestDep = findNewest(stats)

        logger.debug( 'Newest: ', newestDep)

        // Now stat the target file, and if it is older than the source or one of its dependencies,
        // pass it through.  Otherwise, dump it from the stream.
        fs.stat(targetPath, function (err, targetStat) {
          if (!fsOperationFailed(stream, sourceFile, err)) {
            if (newestDep.mtime > targetStat.mtime ||  sourceFile.stat.mtime > targetStat.mtime) {
              stream.push(sourceFile);
            }
          }

          cb();
        });

      })

  }
}

module.exports = function (dest, opts) {

  // calling this without a opts.deps makes this plugin behave exactly like gulp-changed
  if (opts && opts.deps) {
    changed.compareWithDependencies = injectDependencies(opts.deps)
    opts = Object.assign(opts, {hasChanged: changed.compareWithDependencies})
    delete(opts.deps)
  }

  // construct the gulp-changed object with the additional compare method attached - and we have
  // already selected this method by assigning it to opts.hasChanged above
  return changed(dest, opts)

}
