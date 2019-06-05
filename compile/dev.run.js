const webpack = require('webpack')
const merge = require('webpack-merge')
const WebpackServer = require('webpack-dev-server')
const open = require('open')
const url = require('url')
const path = require('path')
const qcConfig = require(path.resolve(process.cwd(), './config.js'))

let webpackOptions = merge(require('../config/dev.config'), qcConfig.dev || {})

module.exports = function() {
    const compiler = webpack(webpackOptions)
    const server = new WebpackServer(compiler, {...webpackOptions.devServer})
    let { port, host, protocol } = webpackOptions.devServer
    let openPage = qcConfig.openPage || 'index'
    port = port || 8080
    host = host || '127.0.0.1'
    protocol = protocol || 'http'
    let uri = url.format({
        protocol,
        hostname: host,
        port,
        pathname: `${openPage}.html`
    })
    server.listen(port, host, () => {
        open(uri)
    })
}