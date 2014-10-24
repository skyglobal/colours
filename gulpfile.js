'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var runSequence = require('run-sequence');
var deploy = require("gulp-gh-pages");
var bower = require('gulp-bower');
var run = require("gulp-run");
var pkg = require('./package.json');
var concat = require('gulp-concat');

var paths= {
    "site": [
        "demo/**/*.html"
    ],
    sass: 'demo/scss',
    css: '_site/css'
};


gulp.task('sass', function() {
    browserSync.notify('<span style="color: grey">Running:</span> Sass compiling');
    return gulp.src(paths.sass + '/*.scss')
        .pipe(sass({
            includePaths: ['scss','bower_components'],
            outputStyle: 'compressed'
        }))
        .pipe(autoprefixer())
        .pipe(gulp.dest(paths.css))
        .pipe(browserSync.reload({stream:true}));
});


gulp.task('browserSync', function() {
    browserSync({
        port: 3456,
        server: {
            baseDir: "_site"
        }
    });
});



gulp.task('watch', function() {
    gulp.watch(paths.jekyll, ['build']);
    gulp.watch(paths.sass + '/**/*.scss', ['sass']);
});


gulp.task('create-site', function() {
    gulp.src(['demo/index.html','demo/_includes/*.html'])
        .pipe(concat('index.html'))
        .pipe(gulp.dest('_site'))
});

gulp.task('build', function(cb) {
    return runSequence(['create-site','bower'],['sass'],
        cb
    );
});


gulp.task('gh-pages', function () {
    gulp.src("./_site/**/*")
        .pipe(deploy({
            cacheDir: '.tmp'
        })).pipe(gulp.dest('/tmp/gh-pages'));
});

gulp.task('bower', function() {
    return bower()
});

gulp.task('run-release-bower', function(cb) {
    run('git tag -a v'+ pkg.version +' -m "release v' + pkg.version +' for bower"; git push origin master v'+ pkg.version).exec();
});



gulp.task('serve', function(callback) {
    return runSequence(
        'build',
        ['browserSync', 'watch'],
        callback
    );
});

gulp.task('release:bower', function(cb) {
    return runSequence(
        'build',
        'run-release-bower',
        cb
    );
});

gulp.task('release:gh-pages', function(cb) {
    return runSequence(
        'build',
        'gh-pages',
        cb
    );
});
