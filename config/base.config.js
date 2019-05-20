const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const babelOptions = require('./babel.config')()
const qcConfig = require(path.resolve(process.cwd(), './qc.config.json'))

module.exports = {
    entry: {
        index: path.join(process.cwd(), './src/entry/index.js')
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
        new htmlWebpackPlugin({
            title: qcConfig.title,
            filename: './index.html',
            template: path.resolve(process.cwd(), './src/entry/index.html'),
            chunks: ['index'],
            env: process.env.NODE_ENV,
            inject: process.env.NODE_ENV === 'development'? false : true,
            favicon: path.resolve(process.cwd(), './src/entry/favicon.ico'),
            meta: {
                viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
            }
        })
    ],
    resolve: {
        extensions: ['.vue', '.js'],
        alias: {
            '@': path.join(process.cwd(), './src')
        },
        modules: [path.resolve(__dirname, '../node_modules'), path.resolve(process.cwd(), './node_modules')]
    },
    externals: {
        'vue': 'Vue'
    }
}