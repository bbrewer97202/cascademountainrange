var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    compass = require('gulp-compass'),
    uglify = require('gulp-uglify');

gulp.task('compass', function() {
    return gulp.src('./src/sass/*.scss')
        .pipe(compass({
            css: './public/css',
            sass: './src/sass',
            require: ['breakpoint','susy']
        }))
        .on('error', function() {
            console.log("sass error TODO");
        })
        .pipe(gulp.dest('./public/css'));
});

gulp.task('autoprefixer', function() {
    return gulp.src('./public/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./public/css'));
});

//minified vendor javascript
gulp.task('scripts-vendor', function() {
    return gulp.src([
            './src/bower_components/angular/angular.min.js',
            './src/bower_components/angular-resource/angular-resource.min.js',
            './src/bower_components/angular-route/angular-route.min.js',
            './src/bower_components/lodash/dist/lodash.underscore.min.js',
            './src/bower_components/angular-google-maps/dist/angular-google-maps.min.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./public/js/'));
});

//source javascript
gulp.task('scripts', function() {
    return gulp.src([
        './src/js/*.js', 
        './src/js/controllers/*.js', 
        './src/js/services/*.js',
        './src/js/directives/*.js',
        ])
        .pipe(concat('script.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('./public/js/'));
});

//watch
gulp.task('watch', function() {
    gulp.watch('./src/js/**/*.js', ['scripts']);
    gulp.watch('./src/sass/**/*.scss', ['compass']);
});

//default task
gulp.task('default', ['scripts-vendor', 'scripts', 'compass', 'autoprefixer', 'watch']);
