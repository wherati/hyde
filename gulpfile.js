'use strict'
require('require-dir')('./gulp/tasks', {recurse: true})

var gulp = require('gulp')

gulp
  .task('develop', ['sass', 'posts', 'pages', 'blog', 'copy', 'watch', 'serve'])


gulp
  .task('default', ['develop'])