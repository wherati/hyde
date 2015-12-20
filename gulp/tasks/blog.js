/**
 * Task to read the `src/blog/index.jade` file and generate corresponding HTML in <dest>/blog.
 *
 * The src/blog/index.jade file corresponds to a list of blog posts with a title, summary and link to the
 * full post
 *
 * The subtask `blog:list` reads in the listing of markdown files in /posts and generates an array of objects
 * for a file named `/posts/year-mm-dd-file-name-of-some-sort.md`
 *  [
 *    {
 *      url: /year/mm/dd/file-name-of-some-sort.md,
 *      front: <object consisting of fields in the post's front-matter YAML>
 *    },
 *    .
 *    .
 *  ]
 *
 * The `url` field is the same URL corresponding to the HTML of the given post, when mixed into the layout template
 * indicated in the post's `layout` field (`post-layout` by default, if absent).  The above array is passed to
 * the blog template (`default-layout` by default) as `posts` (along with build values obtained from `environment.js`)
 *
 */
// Gulp
var gulp = require('gulp')

// Gulp Plugins
var frontmatter = require('gulp-front-matter')
var rename = require('gulp-rename')
var gutil = require('gulp-util')

// Node packages
var util = require('util')
var through = require('through2')
var lazypipe = require('lazypipe')
var path = require('path')
var jade = require('jade')
var vinyl = require('vinyl')

// Local packages
var mapUrl = require('../helpers/mapUrl')
var logger = require('../../lib/logger').setLevel('debug')
var constants = require('../constants')


gulp.task('blog', () => {

  var destination = path.join(constants.build.destination, 'blog')

  logger.debug('[BLOG] : destination: ' + destination)

  // source all the markdown files in /posts
  return gulp.src(constants.posts)

    // map to /year/mo/dd/fname.md
    .pipe(normalize())

    // note that we want ALL the posts here, not the changed ones
    // because we want to create a complete list so we can create the
    // appropriate links in the blog.  We MAY want to filter out, e.g.
    // DRAFT or PRIVATE posts.  The front matter is available in 'blog'
    // task so filtering could be done there as needed.

    // pull out the front matter store in file.front
    .pipe(getFrontMatter())

    .pipe(filterPublished())

    .pipe(gutil.buffer())

    .pipe(sortPosts())

    .pipe(createBlog())

    .pipe(gulp.dest(destination))

})

var normalize = lazypipe()

  .pipe(function renameFile() {

    return rename(mapUrl)

  })

var getFrontMatter = lazypipe()

  .pipe(function removeFrontMatter() {

    return frontmatter({
      property: 'front',
      remove: true
    })

  })

function sortPosts() {

  return through.obj(function (vinylFileArray, enc, cb) {

    cb(null, vinylFileArray.sort(function (a, b) {
      return a.relative > b.relative ? -1 : 1
    }))

  })

}

function filterPublished() {

  return through.obj(function (vinylFile, enc, cb) {

    logger.debug('[BLOG] : vinylFile.front.status : ' + vinylFile.front.status)
    if (constants.build.env === 'development' || vinylFile.front.status === 'publish') {
      this.push(vinylFile)
    }

    cb()
  })
}

function createBlog() {

  var posts = []

  return through.obj(function (vinylFileArray, enc, cb) {

    var self = this

    logger.debug('[BLOG] : Linking ' + vinylFileArray.length + ' post previews into ' + Math.ceil((vinylFileArray.length / constants.pagination)) + ' pages.')

    var fn = jade.compileFile('src/blog/index.jade', {
      pretty: true,
      basedir: constants.baseDir
    })

    vinylFileArray.forEach((vinylFile, index) => {

      // compute the page index
      var pageNum = Math.floor(index / constants.pagination)

      var file = path.parse(vinylFile.relative)
      file.ext = '.html'
      file.base = path.basename(file.base, '.md') + '.html'
      vinylFile.front = Object.assign(vinylFile.front, {
        url: path.join(constants.baseUrl, 'posts', path.format(file))
      })

      // push the current post frontmatter on to the list of posts
      // we'll get the whole array in the 'blog' task
      posts.push(vinylFile.front)

      if (posts.length === constants.pagination || index === (vinylFileArray.length - 1)) {

        var html = fn({
          posts: posts
        })

        var filename = pageNum ? path.join('page' + pageNum, 'index.html') : 'index.html'
        var pageFile = new vinyl({
          path: filename,
          contents: new Buffer(html)
        });

        posts = []
        self.push(pageFile)
      }

    })

    cb()
  })
}
