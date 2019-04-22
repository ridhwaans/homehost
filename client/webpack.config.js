const path = require('path');

const PATHS = {
    src: path.join(__dirname, './src'),
    public: path.join(__dirname, './public')
};

var config = {
    entry: { 
        app: [ 'babel-polyfill', path.resolve(PATHS.src, 'index.js') ] 
    },
    output: {
        path: path.resolve(PATHS.public),
        filename: 'bundle.js',
        publicPath: 'some-virtual-location/'
    },
    devServer: {
        contentBase: path.resolve(PATHS.public),
        historyApiFallback: true,
        port: 3000,
        proxy: {
            '/api/**': {
            target: 'http://localhost:5000',
            changeOrigin: true
            }
        }
    },
    module: {
        rules: [
        {
            test: /\.(jpg|png|gif|svg|pdf|ico)$/i,
            use: [
                {
                    loader: 'url-loader'
                }
            ]
        },
        {
            test: /\.js$/i,
            use: [
                { 
                    loader: 'babel-loader',
                    options: { presets: ['@babel/env', '@babel/react'] }
                }
            ],
            exclude: /(node_modules|bower_components)/
        },
        {   test: /\.css$/i,
            use: [
                {
                    loader: 'style-loader',
                    options: { singleton: true }
                },
                {
                    loader: 'css-loader',
                    options: { 
                        modules: false
                    }
                }
            ],
            include: [
                /(node_modules|bower_components)/, 
                path.resolve(PATHS.src, 'style/node_modules.css')
            ]
        },
        {
            test: /\.css$/i,
            use: [
                {
                    loader: 'style-loader',
                    options: { singleton: true }
                },
                {
                    loader: 'css-loader',
                    options: { 
                        modules: true,
                        camelCase: 'dashes',
                        localIdentName: '[path][name]__[local]' 
                    }
                }
            ],
            exclude: [
                /(node_modules|bower_components)/, 
                path.resolve(PATHS.src, 'style/node_modules.css')
            ]
        }
        ]
    }
};
module.exports = config;