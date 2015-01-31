var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('compress', function() {
    gulp.src('errors_logging.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/errors_logging.min.js'))
});

gulp.task('default', function() {
    gulp.src('errors_logging.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/errors_logging.min.js'));
});