// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var mainBowerFiles = require('main-bower-files');
var inject = require("gulp-inject");
var ts = require('gulp-typescript');
var eventStream = require('event-stream');

var dist = 'public';
var src = 'src';
var views = 'views';
var images = dist + '/images';
var models = dist + '/models';
var songs = dist + '/songs';
var srcJavascripts = src + '/javascripts/';
var bower = 'bower_components';

// Lint Task
gulp.task('lint', function () {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function () {
    return gulp.src('scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function () {
    return gulp.src(src + '/javascripts/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest(dist));
        //.pipe(rename('all.min.js'))
        //.pipe(uglify())
        //.pipe(gulp.dest(dist));
});

gulp.task('typescript', function() {
    var tsResult = gulp.src(src + '/javascripts/**/*.ts')
                       .pipe(ts({
                           declarationFiles: true,
                           noExternalResolve: true
                       }));

    return eventStream.merge( // Merge the two output streams, so this task is finished when the IO of both operations are done.
        tsResult.dts.pipe(gulp.dest(dist + '/release/definitions')),
        tsResult.js.pipe(gulp.dest(dist + '/release/js'))
    );
});

gulp.task('bower', function () {
    return gulp.src(mainBowerFiles())
        .pipe(gulp.dest(dist + '/js'));
});

gulp.task('images', function () {
    return gulp.src(src + '/images/**/*.*')
        .pipe(gulp.dest(images));
});

gulp.task('models', function () {
    return gulp.src([src + '/models/**/*.js', src + '/models/**/*.png'])
        .pipe(gulp.dest(models));
});

gulp.task('songs', function () {
    return gulp.src(src + '/songs/**/*.*')
        .pipe(gulp.dest(songs));
});

gulp.task('index', function () {
    var target = gulp.src(views + '/index.jade');
    var sources = gulp.src([dist + '/js/*.js'], {read: false});
    var mainFile = gulp.src(srcJavascripts + 'main.js');
    
  return target.pipe(inject(mainFile, {read: false}), {name: 'head'})
        .pipe(inject(sources, {read: false}, {name: 'bower'}))
        .pipe(gulp.dest(views));
});

gulp.task('layout', function () {
  var target = gulp.src(views + '/layout.jade');
  var sources = gulp.src([dist + '/stylesheets/*.css'], {read: false});

  return target.pipe(inject(sources))
    .pipe(gulp.dest(views));
});

// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch(src + '/javascripts/**/*.js', ['lint', 'scripts']);
    gulp.watch(src + '/javascripts/**/*.ts', ['typescript']);
    //gulp.watch('scss/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);