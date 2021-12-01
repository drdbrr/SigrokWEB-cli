const webpack = require('webpack');

const config = {
    mode: 'development',
    //mode: 'production',
    //watch: true,
    entry: __dirname + '/src/index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
    experiments:{
        executeModule: true,
        topLevelAwait: true,
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react', ['@babel/preset-env',{
                                loose: false,
                                modules: 'commonjs',
                                //forceAllTransforms: true,
                            }]],
                            plugins: ['@babel/plugin-transform-modules-commonjs', '@babel/plugin-proposal-object-rest-spread', '@babel/plugin-proposal-class-properties', '@babel/plugin-syntax-top-level-await', "babel-plugin-styled-components", "@babel/plugin-proposal-nullish-coalescing-operator", '@babel/plugin-proposal-optional-chaining']
                        },
                        
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
                use: ['url-loader?limit=100000']
            },
            /*
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                {
                    loader: 'file-loader',
                }],
            },
            */
        ]
    }
};
module.exports = config; 
