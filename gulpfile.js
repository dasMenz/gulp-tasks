/**
 * defs
 **/
var gulp 			= require('gulp'),
	concat 			= require('gulp-concat'),
	sass 			= require('gulp-sass'),
	jsmin			= require('gulp-jsmin'),
	cssmin			= require('gulp-cssmin'),
	notify 			= require('gulp-notify'),
	autoprefixer 	= require('gulp-autoprefixer'),
	browserSync 	= require('browser-sync').create();

/**
 * basic files array
 **/
var paths = {
	'dirs'	: {
		'from' 	: './src',
		'to'	: './dist'
	},
	'scss'	: {
		'files' : [
			'./src/scss/app.scss'
		],
		'includePaths' : [
		]
	},
	'js'	: {
		'files' : [
			'./src/js/app.js'
		]
	},
};


/**
 * basic options array
 **/
var options = {
	'sync' : {
		'rel' : true,
		'value' : '../'
	}
}


/**
 * gulp minified build task
 **/
gulp.task('build', function(){
	gulp.src(paths.js.files)
		.pipe(concat('app.js'))
		.pipe(jsmin())
		.pipe(gulp.dest(paths.dirs.to + '/js/'));

	gulp.src(paths.scss.files)
		.pipe(sass({
			includePaths: paths.scss.includePaths
		}).on('error', function(error){
			return notify().write(error);
		}))
		.pipe(autoprefixer({
			browsers: ['last 4 versions'],
			cascade: false
		}))
		.pipe(cssmin())
		.pipe(gulp.dest(paths.dirs.to + '/css/'));
});


/**
* gulp basic styles task
**/
gulp.task('styles', function(){
	return gulp.src(paths.scss.files)
		.pipe(sass({
		includePaths: paths.scss.includePaths
		}).on('error', function(error){
			return notify().write(error);
		}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: true
		}))
		.pipe(gulp.dest(paths.dirs.to + '/css/'));
});

/**
* gulp basic scripts task
**/
gulp.task('scripts', function(){
	return gulp.src(paths.js.files)
		.pipe(concat('app.js'))
		.pipe(gulp.dest(paths.dirs.to + '/js/'));
});


/**
* gulp basic watch task
**/
gulp.task('default', function(){
	return gulp.watch(paths.dirs.from + '/**/*', ['scripts', 'styles']);
})


/**
 * gulp browser sync task
 **/
gulp.task('sync', ['scripts', 'styles'], function(){
	var obj = {};
	if (options.sync.rel) {
		obj.server = {
            baseDir: options.sync.value
        };
	}
	else{
		obj.proxy = options.sync.value;
	}
	browserSync.init(obj);
	gulp.watch(paths.dirs.from + '/**/*', ['sync-build'])
});

/**
* gulp browser reload handler
**/
gulp.task('sync-build', ['scripts', 'styles'], function(done){
	browserSync.reload();
    done();
})