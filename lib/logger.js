var chalk = require('chalk')
var build = require('../gulp/constants').build
var util = require('util')
function nop() {
}

var logger = {}

var format = {
  error: chalk.black.bgRed,
  warning: chalk.black.bgYellow,
  debug: chalk.blue,
  info: chalk.black,
  verbose: chalk.gray
}

var logLevel = build.logLevel

var logLevels = [
  'silent',
  'error',
  'warning',
  'info',
  'debug',
  'verbose'
]

if (logLevels.indexOf(logLevel) < 0) {
  console.log(format.warning(`Invalide logLevel '${logLevel}'. Switching to 'debug'.`))
  logLevel = 'debug'
}


logger.setLevel = function setLevel(level) {

  var methods = ['error', 'warning', 'info', 'debug', 'verbose']

  methods.forEach(type => {
    this[type] = function () {

      var args = Array.prototype.slice.call(arguments,0)

      args.forEach( argument => {
        console.log(format[type](JSON.stringify(argument, null, 2)))
      })

    }
  })

  switch (level) {
    case 'silent':
      this.error = nop
    case 'error':
      this.warning = nop
    case 'warning':
      this.info = nop
    case 'info':
      this.debug = nop
    case 'debug' :
      this.verbose = nop
    default:
      break
  }

  return this

}

logger.setLevel(logLevel)
module.exports = logger