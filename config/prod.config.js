const path = require('path')
const merge = require('webpack-merge')
const cleanWebpackPlugin = require('clean-webpack-plugin')
const baseConf = require('./base.config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = merge(baseConf, {
    mode: process.env.NODE_ENV || 'production',
    output: {
        path: path.join(process.cwd(), './dist'),
        filename: 'js/index.[hash:8].js'
    },
    module: {

    },
    plugins: [
        new cleanWebpackPlugin(['dist'], {root: process.cwd()}), // root 必配
        new MiniCssExtractPlugin({
            filename: 'css/main.[hash:8].css',
            chunkFilename: 'css/[name].[hash:8].css'
        })
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
            minChunks: 3
        }
    }
})
