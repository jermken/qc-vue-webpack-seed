const path = require('path')
const fs = require('fs')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const babelOptions = require('./babel.config')()
const qcConfig = require(path.resolve(process.cwd(), './qc.config.json'))
let topNodeModules = fs.existsSync(path.resolve(__dirname, '../node_modules')) ? path.resolve(__dirname, '../node_modules') : path.resolve(__dirname, '../../../../node_modules')

let pageList = fs.readdirSync(path.join(process.cwd(), './src/entry')) || []
let entryConfig = {}
let htmlList = []
pageList.forEach((item) => {
    entryConfig[item] = path.join(process.cwd(), `./src/entry/${item}/${item}.js`)
    htmlList.push(
        new htmlWebpackPlugin({
            title: qcConfig.title,
            filename: `./${item}.html`,
            template: path.resolve(process.cwd(), `./src/entry/${item}/${item}.html`),
            chunks: [item],
            env: process.env.NODE_ENV,
            inject: process.env.NODE_ENV === 'development'? false : true,
            favicon: path.resolve(process.cwd(), `./src/entry/${item}/favicon.ico`),
            meta: {
                viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
            }
        })
    )
})
module.exports = {
    entry: {
        ...entryConfig
    },
    output: {
        chunkFilename: 'js/[name].bundle.[hash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: require.resolve('vue-loader')
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: [path.join(process.cwd(), './src')],
                use: {
                    loader: require.resolve('babel-loader'),
                    options: babelOptions
                }
            },
            {
                test: /\.(sc|c)ss$/,
                use: [
                    process.env.NODE_ENV !== 'production' ? require.resolve('vue-style-loader') : {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: path.join(process.cwd(), '../')
                        }
                    }, require.resolve('css-loader'), require.resolve('sass-loader')
                ]
            },
            {
                test: /\.(png|gif|jpg|svg|woff|eot|ttf)$/,
                use: [
                    {
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 10000,
                            name: '[name].[hash:8].[ext]',
                            outputPath: 'images'
                        }
                    },
                    require.resolve('img-loader')
                ]
            }
        ]
    },
    plugins:[
        new VueLoaderPlugin(),
        ...htmlList
    ],
    resolve: {
        extensions: ['.vue', '.js'],
        alias: {
            '@': path.join(process.cwd(), './src')
        },
        modules: [topNodeModules, path.resolve(process.cwd(), './node_modules')]
    },
    externals: {
        'vue': 'Vue'
    }
}