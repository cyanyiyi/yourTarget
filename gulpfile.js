var gulp = require('gulp');
var webserver = require('gulp-webserver');
gulp.task('webserver', function(){
    gulp.src('./')
    .pipe(webserver({
        livereload: true,
        directoryListing: true,
        open: true,
        host: '192.168.2.101'
    }))
})