/*	==========================================================================
	Author: Mvishal Shukla
	Updated: --/--/--
	Notes: Hand Coded Gulp JS.
	========================================================================== */

	var gulp = require('gulp'),
		config = require('./gulp/gulp.config')(),
		browserSync = require('browser-sync'),
		reload = browserSync.reload,
		del =  require('del'),
		runSequence = require('run-sequence'),
		$ = require('gulp-load-plugins')({lazy: true});

/*	=========================================================================
	Table of Contents for Styles:
	
	#HelpTask
	#Default Task
	#Clean Task
		*Clean task
		*Clean temp task
		*Clean main.css task
		*Clean Image task
		*Clean Fonts Task
		*Clean Styles Task
		*Clean Scripts
		*Clean Code Task
	#Image Task
	#Fonts Task
	#Html Task
	#Sass Task
	#CSS Task
	#JS Task
	#Watch Task
	#Browser-sync Task
	#Util Functions
		*log
		*clean
	========================================================================== */

/*	==========================================================================
		#HelpTask
	========================================================================== */

	gulp.task('help', $.taskListing);

/*	==========================================================================
		#Default Task
	========================================================================== */

	gulp.task('default', ['help']);

/*	==========================================================================
		#Clean Task
	========================================================================== */

	gulp.task('clean', ['clean-styles', 'clean-scripts', 'clean-fonts', 'clean-images', 'clean-code'], function(){
		log("All Files Cleaned");
	});

	gulp.task('clean-styles', function(){
		clean(config.css_dest);
	});

	gulp.task('clean-scripts', function(){
		clean(config.js_dest);
	});

	gulp.task('clean-fonts', function(){
		clean(config.font_dest);
	});

	gulp.task('clean-images', function(){
		clean(config.image_dest);
	});

	gulp.task('clean-code', function(){
		log('html need to be cleaned');
	});

/*	==========================================================================
		#Image Task
	========================================================================== */

	gulp.task('images', function(){
		log('Compressing and copying images');
		return gulp
			.src(config.image_source)
			.pipe($.plumber({
				handleError: function (err) {
					console.log(err);
					this.emit('end');
				}
			}))
			.pipe($.newer(config.image_dest))
			.pipe($.imagemin({progressive: true, optimizationLevel: 4}))
			.pipe($.size({showFiles: true}))
			.pipe(gulp.dest(config.image_dest))
			//.pipe(reload({stream: true}))
			.pipe($.notify('#Images task finished'));
	});

/*	==========================================================================
		#Fonts Task
	========================================================================== */

	gulp.task('fonts', function(){
		log('Copying fonts');
		return gulp
			.src(config.font_source)
			.pipe($.newer(config.font_dest))
			.pipe(gulp.dest(config.font_dest))
			//.pipe(reload({stream: true}))
			.pipe($.notify('#Fonts task finished'));
	});

/*	==========================================================================
		#Html Task
	========================================================================== */

	gulp.task('html', function(){
		return gulp
			.src(config.html_source)
			.pipe(reload({stream: true}));
			//.pipe($.notify('#Html task finished'));
	});

/*	==========================================================================
		#Sass Task
	========================================================================== */

	gulp.task('sass', function(){
		log('Compiling SCSS --> CSS');
		return $.rubySass(config.sass_source, 
		{
			style: 'expanded',
			lineNumbers: true
		})
		.on('error', $.rubySass.logError)
		.pipe($.autoprefixer({
			browsers: ['last 2 versions', '> 5%']
		}))
		.pipe($.stripCssComments({preserve: /^#/}))
		.pipe($.jsbeautifier({ indent_level: 4 }))
		.pipe(gulp.dest(config.sass_dest))
		.pipe($.notify('#Sass task finished'));
	});

	/*gulp.task('sass', function(){
		log('Compiling SCSS --> CSS');
		return gulp
			.src(config.sass_source)
			.pipe($.plumber())
			.pipe($.sourcemaps.init())
			.pipe($.sass({
				outputStyle: 'expanded'
			})
			.pipe($.sourcemaps.write())
			.on('error', $.sass.logError))
			.pipe($.autoprefixer({
				browsers: ['last 2 versions', '> 5%']
			}))
			.pipe($.stripCssComments({preserve: /^#/}))
			.pipe($.jsbeautifier({ indent_level: 4 }))
			.pipe(gulp.dest(config.sass_dest))
			.pipe($.notify('#Sass task finished'));
	});*/

/*	==========================================================================
		#CSS Task
	========================================================================== */

	gulp.task('css', /*['sass'],*/function(){
		return gulp
			.src(config.css_source)
			.pipe($.stripCssComments())
			.pipe($.concat('app.min.css'))
			.pipe($.uglifycss())
			.pipe($.size({showFiles: true}))
			.pipe(gulp.dest(config.css_dest))
			.pipe(reload({stream: true}))
			.pipe($.notify('#CSS Task Finished'));
	});

/*	==========================================================================
		#JS Task
	========================================================================== */

	gulp.task('js', function(){
		return gulp
			.src(config.js_source)
			.pipe($.plumber())
			.pipe($.concat('app.min.js'))
			.pipe($.uglify())
			.pipe($.size({showFiles: true}))
			.pipe(gulp.dest(config.js_dest))
			.pipe(reload({stream: true}))
			.pipe($.notify('#JS task finished'));
	});

/*	==========================================================================
		#Watch Task
	========================================================================== */

	gulp.task('watch', function(){

		// sass-watcher
		gulp.watch(config.sass_source, ['sass']);

		// css-watcher
		gulp.watch(config.css_source, ['css']);

		//js-watcher
		gulp.watch(config.js_source, ['js']);

		// html-watcher
		gulp.watch(config.html_source, ['html']);

	});

/*	==========================================================================
		#Browser-sync
	========================================================================== */

	gulp.task('serve', function(callback) {
	    runSequence('clean', 'html', 'images', 'fonts', 'sass', 'css', 'js', 'serve-dev', 'watch', callback);
	});

	gulp.task('serve-dev', function(){
		startBrowserSync();
	});

/*	==========================================================================
		#Util Functions
	========================================================================== */

	function startBrowserSync(){

		log('Starting browser-sync...');

		var options = {
			proxy: '127.0.0.1:8000'
		};

		$.connectPhp.server({}, function(){
			browserSync(options);
		});

		gulp.watch('**/*.php').on('change', function () {
			browserSync.reload();
	    });
	}



	function log(msg) {
		if (typeof(msg) === 'object') {
			for (var item in msg) {
				if (msg.hasOwnProperty(item)) {
					$.util.log($.util.colors.blue(msg[item]));
				}
			}
		} else {
			$.util.log($.util.colors.blue(msg));
		}
	}

	function clean(path) {
		log('Cleaning: ' + $.util.colors.blue(path));
		del(path).then(paths => {
			console.log('Deleted files and folders:\n', paths.join('\n'));
		});
	}