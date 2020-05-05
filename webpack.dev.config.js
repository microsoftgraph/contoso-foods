// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* eslint-disable @typescript-eslint/no-var-requires */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const path = require('path');

const dist = path.resolve(__dirname, 'dist');

module.exports = {
    entry: './src/index.ts',
    mode: 'development',
    watch: true,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    configFile: 'tsconfig.json',
                },
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: dist,
    },
    devServer: {
        contentBase: dist,
        compress: true,
        port: 8080,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            { from: 'assets', to: 'assets' },
        ]),
        new HtmlWebpackPlugin({
            title: 'Contoso Foods',
            filename: 'index.html',
            template: 'src/index.html',
            alwaysWriteToDisk: true,
            minify: false,
        }),
        new HtmlWebpackHarddiskPlugin({
            outputPath: dist,
        }),
    ],
};
