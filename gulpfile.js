
var gulp = require('gulp');

const shell = require('gulp-shell');
const fs = require("fs");
const path = require("path");

var autoprefixer = require('gulp-autoprefixer');
var bowerfiles = require('main-bower-files');
const npmFiles = require('gulp-npm-files');
var flatten = require('gulp-flatten');
var cache = require('gulp-cache');
var changed = require('gulp-changed');
var concat = require('gulp-concat');
var cssvalidator = require('gulp-css-validator');
var csslint = require('gulp-csslint');
var imagemin = require('gulp-imagemin');
var inject = require('gulp-inject');
var jshint = require('gulp-jshint');
var mincss = require('gulp-minify-css');
var minhtml = require('gulp-minify-html');
var ngAnnotate = require('gulp-ng-annotate');
var order = require('gulp-order');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var rimraf = require('gulp-rimraf');
// var sass = require('gulp-sass');
var stripDebug = require('gulp-strip-debug');
var stylus = require('gulp-stylus');
var todo = require('gulp-todo');
var uglify = require('gulp-uglify');
var using = require('gulp-using');
var gutil = require('gulp-util');
var connect = require('gulp-connect');

var es = require('event-stream');
var pngcrush = require('imagemin-pngcrush');
var browserify = require('browserify');
var babel = require('babelify');
// const source = require("vinyl-source-stream");
const browserSync = require('browser-sync').create();
const runSequence = require('run-sequence');  // Note! When gulp 4.0 is out this lib is not needed anymore. Source: https://www.npmjs.com/package/run-sequence
var exec = require('child_process').exec;
const through2 = require('through2');

var indexTemplate = "index_template.html";

var p = {

	htmlTemplate: indexTemplate,

	// ----- Our libs ------
	libsCss: [
		'dist/lib/font-awesome/**/*.css',
		'dist/lib/sass-bootstrap/**/*.css',
		'dist/lib/leaflet/**/*.css',
		'dist/lib/**/*.css'
	],
	libsJs: [
		'dist/lib/es5-shim/es5-shim.js',
		'dist/lib/json3/**/*.js',
		'dist/lib/proj4/**/*.js',
		'dist/lib/jquery/**/*.js',
		'dist/lib/sass-bootstrap/**/*.js',
		'dist/lib/leaflet/**/*.js',
		"dist/lib/Leaflet.NonTiledLayer/NonTiledLayer.js", // Must come before NonTiledLayer.WMS.js
		'dist/lib/GeoJSON.WFS/index.js',
		'dist/lib/leaflet.draw/**/*.js',

		'dist/lib/Leaflet.GeometryUtil/dist/*.js',
		'dist/lib/Leaflet.Snap/*.js',

		//'dist/lib/Leaflet.print-smap/**/*.js',
		'lib/jquery.mobile.custom/jquery.mobile.custom.min.js', // Note! I could not install this lib with bower.
		'dist/lib/**/*.js',
		'!dist/lib/leaflet-dist/*', // messing up
		'!dist/lib/intro-guide-js/**/*.js', // Not using global include but UMD import in IntroHelp plugin and built with webpack
		'!dist/lib/libs.js', // Don't use previously compressed lib file
		'!dist/lib/add-to-homescreen/**/*.js', // Exclude this lib, it's optionally injected by plugin
		'core/js/buildLibOverrides.js'  // Override libs js
	],

	// ----- Our code ------
	ourSass: [
		// first
		// "core/css/**/*.scss",

		// last
		"plugins/**/*.scss"

	],
	ourStylus: [
		// first
		"core/css/global.styl",
		"core/css/**/*.styl",

		// last
		"plugins/**/*.styl"
	],
	ourCss: [
		// first
		"core/css/app.css",
		"core/css/lib-overrides.css",

		// last
		"plugins/**/*.css",
		"!plugins/**/_*.css",
		"!plugins/DrawSmap/*.css",
		"!plugins/Edit/**/*.css",
		"!plugins/MyPlugin/**/*.css",
		"!plugins/SideBars/**/*.css",
		"!plugins/ThreeD/**/*.css",
		"!plugins/WorkshopPlugin/**/*.css",
		"core/css/themes/theme-malmo.css"

		
	],
	ourJs: [
		"core/js/smap.js",
		"core/js/*.js",
		"dist/plugins/**/*.js",
		// "plugins/**/*.js",
		// "!plugins/**/_*.js",
		// "!plugins/Test/**/*.js",
		// "!plugins/DrawSmap/*.js",
		// "!plugins/Edit/**/*.js",
		// "!plugins/MyPlugin/**/*.js",
		// "!plugins/SideBars/**/*.js",
		// "!plugins/ThreeD/**/*.js",
		// "!plugins/PluginTemplate.js",
		'!core/js/buildLibOverrides.js'
	]

};


var autoPrefixerOptions = {
	browsers: ["ie >= 8", "last 3 versions", "iOS >= 7"],
	cascade: true,
	add: true,
	remove: true

}


// ----- Tasks ------

gulp.task('cleancode', function() {
	gulp.src("dist/css").pipe(rimraf());
	gulp.src("dist/js").pipe(rimraf());
	gulp.src("dist/plugins").pipe(rimraf());
	gulp.src("dist/*.*").pipe(rimraf());
});
gulp.task('cleanlib', function() {
	return gulp.src("dist/lib").pipe(rimraf());
});
// gulp.task('cleanconfigs', function() {
// 	return gulp.src("dist/configs").pipe(rimraf());
// });
gulp.task('cleanimg', function() {
	return gulp.src("dist/img").pipe(rimraf());
});
gulp.task('clean', ['cleanlib', 'cleancode']); // Clean all but img folder
gulp.task('cleantotal', function() {
	return gulp.src("dist").pipe(rimraf());
});


var onError = function(err) {
	console.log(err.toString());
  	// this.emit('end');
};


gulp.task('move', function() {
	gulp.src("plugins/**/resources/**/*") //, {base: "./"})
		.pipe(flatten())
		// .pipe(using())
		.pipe(gulp.dest("dist/resources/"));
});

// ---- Our code -----

gulp.task('ourcsscompile', function() {
	var streamStylus = gulp.src(p.ourStylus, {base: "./"})
			.pipe(stylus()).on("error", onError);
	// var streamSass = gulp.src(p.ourSass, {base: "./"})
	// 		.pipe(sass());

	return es.merge(streamStylus) //streamSass)
			.pipe(autoprefixer(autoPrefixerOptions)) //.on('error', onError)
			.pipe(gulp.dest("."));
});


gulp.task('ourcss', ['ourcsscompile'], function() {
	return gulp
		.src(p.ourCss)
		.pipe(autoprefixer(autoPrefixerOptions)) //"last 1 version", "> 1%", "ie 8", "ie 9"))
		// .pipe(csslint())
		// .pipe(csslint.reporter())
		// .pipe(order(p.ourCss.concat("*")))
		.pipe(concat('smap.css'))
		.pipe(mincss())
		// .pipe(rename("smap.css"))
		.pipe(gulp.dest("dist"))
		.pipe(connect.reload());
});


function runWebPack(callback) {
	exec( path.resolve('node_modules/.bin/webpack'), function(error) {
		if (error) {
			console.error('exec error: '+error);
			return;
		}
		callback();
	});
}

// gulp.task("webpack", function() {
// 	var pass = through2.obj();
// 	runWebPack();
// 	return pass;
// });


gulp.task('ourjs:merge', function() {
	return gulp.src(p.ourJs)
		// .pipe(order(p.ourJs.concat("*")))
		// .pipe(jshint())
  // 		.pipe(jshint.reporter('default'))
		// .pipe(fs.createWriteStream("bundle.js"))
  		.pipe(stripDebug())
  		.pipe(ngAnnotate())
		.pipe(uglify())  // {mangle: false}
  		.pipe(concat("smap.js"))
		.pipe(gulp.dest("dist"));

});


gulp.task('ourjs', function(callback) {
	runWebPack(function() {
		gulp.start("ourjs:merge");
		callback();
	});
	return through2.obj();
});





gulp.task('images', function () {
	var imgDest = 'dist/img';
	return gulp
		.src(['img/**/*.{png,jpg,jpeg,gif}'])
		.pipe(changed(imgDest))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngcrush()]
		}))
		.pipe(gulp.dest(imgDest));
});

gulp.task('configs', function() {
	return gulp
		.src(['examples/configs/*.js'])
			.pipe(gulp.dest("dist/configs"));
});

// gulp.task('movecssresources', function() {
// 	return gulp
// 		.src(['dist/lib/**/*.{eot,svg,ttf,woff,png,jpg,jpeg,gif}'], {base: "dist/lib/", ignorePath: "dist/lib/"})
// 		.pipe(gulp.dest("dist/css"));
// });

gulp.task("libs:npmfiles", function() {
	gulp.src(npmFiles(), {base: "./node_modules/"}).pipe(gulp.dest("dist/lib"));  // {checkExistence: true}
});

gulp.task('libs', ["libs:npmfiles"], function() {
	return gulp.src(bowerfiles(), {base: "./bower_components/"}).pipe(gulp.dest("dist/lib"));  // {checkExistence: true}
});

gulp.task('libsjs', ["libs"], function() {
	return gulp
		.src(p.libsJs)
		// .pipe(order(p.libsJs.concat("*")))
		// .pipe(using())
  		.pipe(concat("libs.js"))
		// .pipe(uglify())  // {mangle: false}
		.on('error', onError)
		.pipe(gulp.dest("dist"));
});

// gulp.task('libscss', function() {
// 	return gulp
// 		.src(p.libsCss)
// 		.pipe(autoprefixer("last 1 version", "> 1%", "ie 8"))
// 		// .pipe(csslint())
// 		// .pipe(csslint.reporter())
// 		// .pipe(order(p.ourCss.concat("*")))
// 		.pipe(concat('libs.css'))
// 		.pipe(mincss())
// 		// .pipe(rename("smap.css"))
// 		.pipe(gulp.dest("dist"));
// });

gulp.task('htmlinjectdev', ["libs", "ourcss", "ourjs"], function() {
	var libsJs = p.libsJs.slice(0, p.libsJs.length-1); // we don't want buildLibOverrides.js because we don't compress libs
	var devSrcs = libsJs.concat(p.libsCss).concat(p.ourJs).concat(p.ourCss);
	return gulp
		.src(p.htmlTemplate)
		.pipe(inject(gulp.src(devSrcs, {read: false}), {addRootSlash: false}))
		.pipe(rename("dev.html"))
		.pipe(gulp.dest("."));
});

gulp.task('htmlinjectprod', ["libsjs", "ourcss", "ourjs"], function() {
	var libsJs = ["dist/libs.js"]; //p.libsJs
	var libsCss = p.libsCss; //["dist/libs.css"];
	var prodSrcs = libsJs.concat(libsCss).concat("dist/smap.js").concat("dist/smap.css");
	return gulp
		.src(p.htmlTemplate)
		.pipe(inject(gulp.src(prodSrcs, {read: false}), {addRootSlash: false, ignorePath: 'dist/'}))
		.pipe(rename("index.html"))
		.pipe(gulp.dest("dist"));
});
gulp.task('htmlinject', ["htmlinjectdev", "htmlinjectprod"]);

gulp.task('htmlcompress', ['htmlinject'], function() {
	return gulp
		.src('index.html')
		.pipe(minhtml())
		.pipe(gulp.dest("."));
});
gulp.task('html', ["htmlcompress"]);





// Build our code (during dev)
gulp.task('ourcode', ["ourcss", "ourjs"]);  // "move"

gulp.task('_full', ["images", "move", "configs", "ourcode"], function() {
	gulp.start("html");
});

// Clean the code and libs and then make a full build (i.e. fetch libs to dist,
// compile js/css/sass/styl and insert into HTML).
gulp.task('full', ["cleancode"], function() {
	return gulp.start("_full");
});

gulp.task('test', function() {
	// var pluginFolders = fs.readdirSync("./plugins");
	// console.log(pluginFolders);
	
	return gulp.src('test/*.js', {read: false})
		.pipe(shell(["node_modules/.bin/mocha-casperjs test/opacity.js"]));
});

// Note! It's wise to run <bower update> before resetting. Thereby, packages will be
// up to date and any missing files (however that might happen...) will be filled-in.
gulp.task('reset', ["cleantotal", "full"]);


gulp.task('webserver', function() {
	connect.server({
		port: 8090,
		livereload: true
	});
});

gulp.task('watch:css', function() {
	var filesToWatch = [].concat(p.ourStylus);
	// var info = autoprefixer(autoPrefixerOptions).info();
	// console.log(info);
	return gulp.watch(filesToWatch).on('change', function(file) {
		return gulp.src( file.path )
			.pipe(stylus()).on("error", onError)
			.pipe(autoprefixer(autoPrefixerOptions)).on('error', onError)
			.pipe(gulp.dest( path.dirname(file.path) ));

	});
});

// gulp.task("testcss", function() {
// 	return gulp.src( "./plugins/IntroHelp/IntroHelp.css" )
// 			.pipe(autoprefixer(autoPrefixerOptions)).on('error', onError)
// 			.pipe(gulp.dest( "./plugins/IntroHelp/IntroHelp" ));
// });

gulp.task("watch:js", function() {
	return gulp.watch(["plugins/**/*.js"]).on('change', function(file) {
		const inFile = file.path;
		const outFile = path.join(__dirname, "dist/plugins", path.basename(file.path));
		// const outFile = path.join(path.dirname(file.path), path.basename(file.path).split(".").slice(0, -1).concat([".js"]).join("."));
		
		// console.log(file.path + " " + outFile);
		const commandLine = ["node_modules/.bin/webpack", inFile, outFile, "--config webpack.config.watch.js"].join(" ");
		exec(commandLine);
	});
});

gulp.task('watchweb', ["webserver", "watch"]); // Allow auto-publishing whenever something changes

gulp.task('default', ["watch"]); // Note! <gulp> is same as <gulp default>






