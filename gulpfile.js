'use strict';

var gulp = require('gulp');
var pkg = require('./package.json');
pkg.refresh = function (){ return require('./package.json');}
var skyComponentHelper = require('gulp-sky-component-helper')(gulp, pkg);
var paths = skyComponentHelper.paths;
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var rename = require("gulp-rename");

gulp.task('pre-build', function(cb){

    return gulp.src('bower_components/bskyb-typography/dist/css/main.css')
        .pipe(rename('typography.css'))
        .pipe(gulp.dest('_site/css/'))

});