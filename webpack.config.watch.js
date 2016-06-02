const webpack = require('webpack');
// const fs = require('fs');
// const path = require('path');


// console.log(entries);

module.exports = {
	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: /(apps|bower_components|dist|examples|node_modules|test|tutorials|utils|ws)/g,
			loader: 'babel',
			query: {
				presets: ['es2015'] // 'stage-0', 'react']
			}
		}]
	}
	// plugins: [
	// 	new webpack.optimize.UglifyJsPlugin({
	// 		compress: {
	// 			warnings: false
	// 		},
	// 		output: {
	// 			comments: false
	// 		},
	// 	})
	// 	// ,
	// 	// new webpack.DefinePlugin({
	// 	// 	'process.env': {
	// 	// 		'NODE_ENV': JSON.stringify('production')
	// 	// 	}
	// 	// })
	// ]
}