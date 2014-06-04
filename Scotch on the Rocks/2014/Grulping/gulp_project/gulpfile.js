// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var header = require('gulp-header');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('javascripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    var headerValue = "Evaluated by gulp.\n";
    return gulp.src('javascripts/*.js')
        .pipe(concat('combined.js'))
        .pipe(header(headerValue))
        .pipe(gulp.dest('dist'))
        .pipe(rename('combined.min.js'))
        .pipe(uglify())
        .pipe(header(headerValue))
        .pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('javascripts/*.js', ['lint', 'scripts']);
});

// Default Task
gulp.task('default', ['lint', 'scripts', 'watch']);