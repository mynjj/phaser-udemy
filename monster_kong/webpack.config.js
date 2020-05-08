const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var phaserModule = path.join(__dirname, '/node_modules/phaser/')
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
var pixi = path.join(phaserModule, 'build/custom/pixi.js')
var p2 = path.join(phaserModule, 'build/custom/p2.js')

module.exports = (env, argv)=>({
    mode: 'development',
    entry: {
        app: './src/index.js',
        vendor: ['pixi', 'p2', 'phaser']
    },
    devtool: 'eval-source-map',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
            {test: /pixi\.js/, loader: 'expose-loader?PIXI'},
            {test: /p2\.js/, loader: 'expose-loader?p2'},
            {test: /\.(png|svg|jpg|gif|mp3|ogg)$/, loader: 'file-loader'}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html',
            chunks: ['vendor', 'app'],
            chunksSortMode: 'manual'
        })
    ],
    resolve: {
        extensions: ['.js'],
        alias: {phaser, pixi, p2}
    },
});
