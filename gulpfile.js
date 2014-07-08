
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var bowerfiles = require('gulp-bower-files');
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
var ngmin = require('gulp-ngmin');
var order = require('gulp-order');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var rimraf = require('gulp-rimraf');
var sass = require('gulp-sass');
var stripdebug = require('gulp-strip-debug');
var stylus = require('gulp-stylus');
var todo = require('gulp-todo');
var uglify = require('gulp-uglify');
var using = require('gulp-using');
var gutil = require('gulp-util');

var es = require('event-stream');
var pngcrush = require('imagemin-pngcrush');



var p = {

	// ----- Our libs ------
	libsCss: [
		'build/lib/sass-bootstrap/**/*.css'

	],
	libsJs: [
		'build/lib/proj4/**/*.js',
		'build/lib/jquery/**/*.js',
		'build/lib/sass-bootstrap/**/*.js',
		'build/lib/leaflet/**/*.js',
		'build/lib/**/*.js'
	],

	// ----- Our code ------
	ourSass: [
		// first
		"core/css/**/*.scss",

		// last
		"plugins/**/*.scss"

	],
	ourStylus: [
		// first
		"core/css/**/*.styl",

		// last
		"plugins/**/*.styl"
	],
	ourCss: [
		// first
		"core/css/app.css",

		// last
		"plugins/**/*.css",
		"!plugins/MyPlugin/**/*.css",
		"!plugins/SideBars/**/*.css",
		"!plugins/ThreeD/**/*.css",
		"!plugins/WorkshopPlugin/**/*.css",

		
	],
	ourJs: [
		"core/js/smap.js",
		"core/js/*.js",
		"plugins/**/*.js",
		"!plugins/MyPlugin/**/*.js",
		"!plugins/SideBars/**/*.js",
		"!plugins/ThreeD/**/*.js",
		"!plugins/WorkshopPlugin/**/*.js",
		"!plugins/PluginTemplate.js"
	]

};





// ----- Tasks ------

gulp.task('cleancss', function() {
	return gulp.src("dist/css").pipe(clean());
});
gulp.task('cleanjs', function() {
	return gulp.src("dist/js").pipe(clean());
});
gulp.task('cleanlib', function() {
	return gulp.src("dist/lib").pipe(clean());
});
gulp.task('cleanimg', function() {
	return gulp.src("dist/img").pipe(clean());
});
gulp.task('clean', function() {
	return gulp.src("dist").pipe(clean());
});


gulp.task('images', ['cleanimg'], function () {
    return gulp
    	.src(['img/**/*.png'])
        .pipe(imagemin({
        	progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('libs', ['cleanlib'], function() {
	return gulpBowerFiles().pipe(gulp.dest("dist/lib"));
});

gulp.task('htmlinject', ['libs'], function() {
	return gulp
		.src('index_template.html')
		.pipe(inject(libsJs.concat("dist/js/*.js"), {read: false}))
		.pipe(rename("index.html"))
		.pipe(gulp.dest("."));
});

gulp.task('ourcsscompile', function() {
	var streamStylus = gulp.src(p.ourStylus, {base: "./"})
			.pipe(stylus());
	var streamSass = gulp.src(p.ourSass, {base: "./"})
			.pipe(sass());

	return es.merge(streamStylus, streamSass)
		.pipe(gulp.dest("."));
});


gulp.task('ourcss', ['cleancss', 'ourcsscompile'], function() {
	return gulp
		.src(p.ourCss)
		.pipe(order(p.ourCss).concat("*"))
		.pipe(autoprefixer())
		.pipe(csslint())
		.pipe(csslint.reporter())
		.pipe(concat('smap.css'))
		.pipe(mincss())
		// .pipe(rename("smap.css"))
		.pipe(gulp.dest("dist/css"));
});



gulp.task('ourjs', ['cleanjs'], function() {
	return gulp
		.src(ourJs)
		.pipe(order(ourJs.concat("*")))
		.pipe(uglify())
		.pipe(gulp.dest("dist/js"));
});




gulp.task('dev', ["clean", "ourcss"]);


gulp.task('watch', function() {

	gulp.pipe(gulp.watch( ourJs ), ["ourjs"] ))
	return gulp
		.pipe(gulp.watch( ourCss.concat(ourStylus).concat(ourSass), ["ourcss"] ));
});





























