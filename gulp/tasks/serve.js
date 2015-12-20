'use strict'

let gulp = require('gulp')
let path = require('path')
let browserSync = require('browser-sync')
let constants = require('../constants')
let server = browserSync.create('static-server')

function nop(){}


let serverConfig = {
  ui: false,
  files: path.join(constants.build.destination, '**/*.*'),
  server: {
    baseDir: [constants.build.destination]
  },

  port: constants.port
}

gulp.task('serve', () => {

  server.init(serverConfig, nop)

})

module.exports = server