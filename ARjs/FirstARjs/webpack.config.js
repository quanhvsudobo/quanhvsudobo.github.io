const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');

const PATH_DIST = path.join(__dirname, 'dist/assets');
const PATH_SRC = path.join(__dirname, 'src')
console.log('path: ' + PATH_SRC);

module.exports = {
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
    },
    devtool: 'source-map',
    entry: {
        /*define here*/
        home_style: PATH_SRC + '/css/index.css',
        /*end */
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist/assets')
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader?url=false',
                    'sass-loader',
                ]
            },
            {
                test: /\.(png|svg|jpg|gif|jpeg)$/,
                loader: "file-loader?name=[name].[ext]",
            },
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: PATH_SRC + '/files', to: 'files'},
            // {from: PATH_SRC + '/fonts', to: 'fonts'},
        ]),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
        }),
        new RemovePlugin({
            before: {
                // parameters for "before normal compilation" stage.
            },
            watch: {
            },
            after: {
                test: [
                    {
                        folder: PATH_DIST,
                        method: (absoluteItemPath) => {
                            return new RegExp(/(.*)?_style\.js$/, 'm').test(absoluteItemPath);
                        },
                        recursive: true
                    },
                    {
                        folder: PATH_DIST,
                        method: (absoluteItemPath) => {
                            // return new RegExp(/(.*)?\.js\.map$/, 'm').test(absoluteItemPath);
                        },
                        recursive: true
                    },
                ]
            }
        })
    ],
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },

};
