const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = ()=>({
    entry: './src/main.js',
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    module: {
        rules: [
            {test: /.js$/, exclude: /node_modules/,loader: 'babel-loader'},
            {test: /\.(png|svg|jpg|gif|mp3|ogg)$/, loader: 'file-loader'}
        ]
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        // HTML where our bundles will be included
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html',
        })
    ],
    resolve: {
        // Avoid specifying extension on import
        extensions: ['.js']
    }
});
