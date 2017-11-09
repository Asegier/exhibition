//REQUIRES
var 
    gulp        = require("gulp"),
    sass        = require("gulp-sass"),
    browserSync = require('browser-sync').create(),
    reload      = browserSync.reload,
    fileinclude = require('gulp-file-include'),
    useref      = require('gulp-useref'),
    uglify      = require('gulp-uglify'),
    gulpIf      = require('gulp-if'),
    imagemin    = require('gulp-imagemin'),
    cache       = require('gulp-cache');

//SOURCE AND DESTINATION
var
    source = 'app/',
    buildSource ='app/build/',
    dest   = 'app/build/';

//BOOTSTRAP SCSS SOURCE 
var bootstrapSass = {
    in: './node_modules/bootstrap-sass/'
};

//BOOTSTRAP FONTS SOURCE
var fonts = {
    in: [source + 'fonts/*.*', bootstrapSass.in + 'assets/fonts/**/*'],
    out: dest + 'fonts/'
};

//SCSS SOURCE FOLDER: .SCSS FILES
var scss = {
    in: source + 'scss/style.scss',
    out: dest + 'styles/',
    watch: source + 'scss/**/*.scss',
    sassOpts: {
        outputStyle: 'nested',
        precison: 3,
        errLogToConsole: true,
        includePaths: [bootstrapSass.in + 'assets/stylesheets']
    }
};

//JS SOURCE FOLDER: .JS FILES
var js = {
    in: source + 'scripts/*.js',
    out: dest + 'scripts/',
    watch: source + 'scripts/*.js'
};


//COPY BOOTSTRAP REQUIRED FONTS TO DEST *** only if needed
  // gulp.task('fonts', function () {
  //     return gulp
  //         .src(fonts.in)
  //         .pipe(gulp.dest(fonts.out));
  // });

gulp.task('fileinclude', function() {
  return gulp.src([source + 'html/**/*.html', '!./html/en/include/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(dest))
    .pipe(reload({
      stream: true
    }))
});

//INCLUDE JS COMPONENTS via NPM
gulp.task('bootstrap-js', function() {
  return gulp.src('./node_modules/bootstrap-sass/assets/javascripts/bootstrap.js')
    .pipe(gulp.dest(dest + "scripts/public/"))
})
gulp.task('jquery-js', function() {
  return gulp.src('./node_modules/jquery/dist/jquery.js')
    .pipe(gulp.dest(dest + "scripts/public/"))
})

gulp.task('js-components', ['jquery-js', 'bootstrap-js'], function(){
  console.log("js-components gulp task running");
})

//MINIFY JS FILES
gulp.task('useref', function(){
  return gulp.src(source+ 'html/**/*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest(dest))
});

//COMPILE SCSS
gulp.task('sass', function() {
  return gulp.src(scss.in) // Gets all files ending with .scss in app/scss
    .pipe(sass((scss.sassOpts)))
    .pipe(gulp.dest(scss.out))
    .pipe(reload({
      stream: true
    }))
});

gulp.task('images', function(){
  return gulp.src(source + 'images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest(dest + 'images'))
});

// process JS files and return to the stream
gulp.task('js', function () {
    return gulp.src(js.in)
        .pipe(gulp.dest(js.out))
        .pipe(reload({
          stream: true
        }))
});

// ensures these tasks are completed before reloading browsers
gulp.task('include-watch', ['fileinclude'], reload);
gulp.task('js-watch', ['js'], reload);

// Gulp watch syntax, browserSync and sass must finish before watch can start
gulp.task('default', ['browserSync','js', 'sass', 'fileinclude'], function(){
  gulp.watch(scss.watch, ['sass']); 
  // Reloads the browser whenever HTML or JS files change
  gulp.watch(source + 'html/**/*.html', ['include-watch']); 
  gulp.watch(js.watch, ['js-watch']); 
})

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: dest
    },
    port: 9219
  })
})