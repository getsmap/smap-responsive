const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

var excludePaths = [
	/\/\./,  // starting with "."
	/Add2HomeScreen/,
	/VspuHeaderLund/,
	/SearchLund/,
	/ThreeD/,
	/WorkshopPlugin/,
	/PluginTemplate\.js/
];

function fileList(dir) {
	return fs.readdirSync(dir).reduce(function(list, file) {
		var name = path.join(dir, file);
		for (var i=0,len=excludePaths.length; i<len; i++) {
			if (excludePaths[i].test(name)) {
				return list;
			}
		}
		var isDir = fs.statSync(name).isDirectory();
		// Check for js/jsx extension
		var pass = isDir ? true : /\.jsx?$/.test(name);
		if (!pass) {
			return list;
		}
		return list.concat(isDir ? fileList(name) : [name]);
	}, []);
}

// console.log(fileList("plugins"));

var entries = {};
var files = fileList("plugins");
files.forEach(function(filePath) {
	var fileArr = filePath.split("/");
	var fileName = fileArr[fileArr.length-1];
	entries[ fileName ] = path.join(__dirname, filePath);  // if not giving abs path it will look in node_modules
});

// console.log(entries);

module.exports = {
	entry: entries,
	output: {
		path: path.join(__dirname, "dist/plugins"),
		filename: '[name]'
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			exclude: /(apps|bower_components|dist|examples|node_modules|test|tutorials|utils|ws)/g,
			loader: 'babel',
			query: {
				presets: ['es2015'] // 'stage-0', 'react']
			}
		}]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			output: {
				comments: false
			},
		})
		// ,
		// new webpack.DefinePlugin({
		// 	'process.env': {
		// 		'NODE_ENV': JSON.stringify('production')
		// 	}
		// })
	]
}