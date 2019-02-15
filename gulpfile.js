var gulp = require('gulp');
var del = require('del');
var gulpIf = require('gulp-if');
var sass = require('gulp-sass');
var cache = require('gulp-cache');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();


gulp.task('sass', function () {
    return gulp.src('app/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(sass())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
});

gulp.task('useref', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function () {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean:dist', function () {
    return del.sync('dist');
});

gulp.task('build', function (callback) {
    runSequence('clean:dist',
        ['sass', 'useref', 'images', 'fonts'],
        callback
    )
});

gulp.task('default', function (callback) {
    runSequence(['sass', 'browserSync', 'watch'],
        callback
    )
});

gulp.task('watch', ['browserSync', 'sass'], function (){
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
})