/**
 * Created by caasjj on 12/17/15.
 */
'use strict'
var path = require('path')

// base directory of this site's root index.html relative to server's www root
var baseUrl = '/'

// baseDirectory where files are searched for building, e.g. by jade, etc.
var baseDir = './'

// Output root directories
var tempDir = path.join(baseDir, '.tmp')
var buildDir = path.join(baseDir, 'build')

module.exports = {

  baseUrl: baseUrl,

// Bse directory
  baseDir: baseDir,

// Source Directories
  srcDir   : `src`,
  postsDir: `posts`,
  templatesDir: `templates`,
  layoutsDir: `src/templates/layouts`,
  stylesDir: `src/styles`,
  assetsDir: `src/assets`,

// Source files to be compiled
  pages: `src/pages/**/*.jade`,
  blog: `src/blog/*.jade`,
  templates: `src/templates/**/*.jade`,
  posts: `posts/*.md`,
  styles: `src/styles/**/*.scss`,
  scripts: `src/scripts/**/*.js`,
  assets: `src/assets/**/*.*`,

// Destinations
  tempDir: tempDir,
  buildDir: buildDir

}

// REFACTOR : refactor to get these build parameter from the command line using e.g. yargs or commander
var builds =  {

  "production": {
    "destination": buildDir,
    "logLevel": "error"
  },

  "development": {
    "destination": tempDir,
    "logLevel": "info"
  }

}

var env = process.env.SITE_BUILD_MODE === 'production' ? 'production' : 'development'
var port = process.env.SITE_SERVER_PORT || 8081
var pagination = process.env.SITE_PAGINATION || 8

module.exports.build = builds[env]
module.exports.build.env = env
module.exports.port = port
module.exports.pagination = pagination

