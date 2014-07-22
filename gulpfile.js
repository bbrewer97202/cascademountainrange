var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');


//minified vendor javascript
gulp.task('scripts-vendor', function() {
    return gulp.src([
            './src/bower_components/angular/angular.min.js',
            './src/bower_components/angular-resource/angular-resource.min.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./public/js/'));
});

//source javascript
gulp.task('scripts', function() {
    return gulp.src(['./src/js/*.js', './src/js/controllers/*.js', './src/js/services/*.js'])
        .pipe(concat('script.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('./public/js/'));
});

//watch
gulp.task('watch', function() {
    gulp.watch('./src/js/**/*.js', ['scripts']);
});

gulp.task('default', ['scripts-vendor', 'scripts', 'watch']);
