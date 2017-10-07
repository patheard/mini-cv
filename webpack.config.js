const path = require("path");
const CleanWebpackPlugin = require( "clean-webpack-plugin" );
const CopyWebpackPlugin = require( "copy-webpack-plugin" );
const HtmlWebpackPlugin = require( "html-webpack-plugin" );
const UglifyJSPlugin = require( "uglifyjs-webpack-plugin" );

module.exports = {
	entry: "./src/js/index.js",
	devtool: "inline-source-map",
	module: {
		rules: [
			{	// Run jshint during build
				test: /\.js$/,
				enforce: "pre",
				exclude: /node_modules/,
				use: [{
					loader: "jshint-loader"
				}]
			}
		]
	},	
	plugins: [
		// Clean up previous builds
		new CleanWebpackPlugin([
			"./dist"
		]),
		// Copy static resources.  Module exports are not used since these assets are only for my resume template.
		new CopyWebpackPlugin([
			{ from: "./src/css", to: "../css" },
			{ from: "./src/img", to: "../img" }
		]),
		// Generate the HTML
		new HtmlWebpackPlugin({
			template: "./src/index.html",
			filename: "../index.html"
		}),
		// Minify the JS
		new UglifyJSPlugin()
	],
	output: {
		filename: "bundle.js",
		path: path.resolve( __dirname, "./dist/js" )
	}
};