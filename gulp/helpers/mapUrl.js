// This function simply takes a file named yyyy-mm-dd-file-name-of-some-form.md, and turns it into one
// used by markdown to map the file to a URL /year/mo/dd/file-name-of-some-form.md
module.exports = function mapUrl(path) {
    var parsed = path.basename.split('-')
    var year = Number.isInteger(+parsed[0]) ? parsed[0] : '0'
    var month = Number.isInteger(+parsed[1]) ? parsed[1] : '0'
    var day = Number.isInteger(+parsed[2]) ? parsed[2] : '0'
    var basename = parsed.slice(3).join('-')

    // display '1' as '01', '2' as '02', etc.
    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    // throw error on invalid filenames
    if (year < 2000 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 30) {
      throw new Error('Invalid filename ', path.basename)
    }

    // MUST modify the original 'path' object - it is passed by reference and will be used
    path.dirname = [year, month, day].join('/')
    path.basename = basename

    return path

}

// Simple highlight function used by the markdown call in gulp/tasks/post.js
function highlight(code, lang, callback) {
  require('pygmentize-bundled')({lang: lang, format: 'html'}, code, function (err, result) {
    callback(err, result.toString())
  })
}
