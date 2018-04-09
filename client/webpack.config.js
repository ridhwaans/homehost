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
        publicPath: '/'
    },
    devServer: {
        contentBase: path.resolve(PATHS.public),
        port: 3000,
        historyApiFallback: true,
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
            test: /\.js$/,
            use: [
                { 
                    loader: 'babel-loader',
                    options: { presets: ['@babel/env', '@babel/react', '@babel/stage-2'] }
                }
            ],
            exclude: /(node_modules|bower_components)/
        },
        {   test: /\.css$/,
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
            test: /\.css$/,
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