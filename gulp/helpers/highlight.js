module.exports =function highlight(code, lang, callback) {
  require('pygmentize-bundled')({lang: lang, format: 'html'}, code, function (err, result) {
    callback(err, result.toString())
  })
}