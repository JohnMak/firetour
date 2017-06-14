var gulp = require('gulp');
var debug = require('gulp-debug');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');

var path_node_modules   = "./node_modules/";
var path_sources        = "./frontend/";
var path_app_root       = "./frontend/main.js";
var path_static_build   = "./public/build/";


function rebuild_app(is_debug) {


    var b = browserify({
        debug: is_debug,
        cache: {},
        packageCache: {},
        fullPaths: true,
        paths: [path_node_modules, path_sources]
    });
    if (is_debug) {
        console.log("APP WATCH");
        b = watchify(b);
        b.on('update', function () {
            shared_build_app(b, is_debug);
        });
        b.on('time', function (time) {
            console.log("APP REBUILT IN " + time / 1000 + "s");
        })
    }
    b.add(path_app_root);
    shared_build_app(b, is_debug);
}

function shared_build_app(b, is_debug) {
    console.log("APP REBUILDING...");
    b.bundle()
        .pipe(source("frontend.min.js"))
        .pipe(buffer())
        .pipe(gulp.dest(path_static_build))
        .pipe(debug({title: 'APP REBUILT:'}))
}


gulp.task('default', function () {
    rebuild_app(true);
});