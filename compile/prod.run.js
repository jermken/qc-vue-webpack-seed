const logger = require('../lib/util/logger')
const ora = require('ora')
const webpack = require('webpack')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
const merge = require('webpack-merge')
const path = require('path')
const qcConfig = require(path.resolve(process.cwd(), './config.js'))

module.exports = function(option) {
    const webpackOptions = merge(require('../config/prod.config')(option), qcConfig.prod || {})
    const compiler = webpack(webpackOptions)
    let spinner = ora('')

    spinner.start();
    (new ProgressPlugin((percentage) => {
        spinner.text = `compiling... ${(percentage * 100).toFixed(0)}%`
    })).apply(compiler)
    compiler.run((err) => {
        if(err) {
            spinner.fail()
            logger.error(err)
        } else {
            spinner.succeed()
            logger.success('compiled successfully')
        }
    })
}