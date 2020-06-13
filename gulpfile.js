const { watch, series, src, dest } = require('gulp');
const gulp = require('gulp');
const sass = require('gulp-sass');
const minify = require('gulp-minify');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

const browserSync = require('browser-sync');
const server = browserSync.create();
  
function serve() {
    server.init({
      server: {
        baseDir: 'app'
      }
    });
}

function reload() {
    server.reload();
}

function style(){
    return gulp.src('app/scss/app.scss')
               .pipe(sass({ includePaths: ['node_modules/foundation-sites/scss']}).on('error', sass.logError))
               .pipe(sourcemaps.init())
               .pipe(autoprefixer())
               .pipe(sass().on('error', sass.logError))
               .pipe(sourcemaps.write('./maps'))
               .pipe(gulp.dest('app/css'))
               .pipe(server.stream())
}

function script(){
     return gulp.src(['app/js/*.js','app/js/vendor/*.js'])
               .pipe(minify())
            //    .pipe(rename({ extname: '.min.js' }))
               .pipe(gulp.dest('app/js'));
}

function imagesmini(){
    return gulp.src('app/images/*')
               .pipe(imagemin([
                    imagemin.gifsicle({interlaced: true}),
                    imagemin.mozjpeg({quality: 75, progressive: true}),
                    imagemin.optipng({optimizationLevel: 5}),
                    imagemin.svgo({
                        plugins: [
                            {removeViewBox: true},
                            {cleanupIDs: false}
                        ]
                    })
               ]))
               .pipe(gulp.dest('app/images/min'))
}

exports.build = series(style, imagesmini);
exports.default = function() {
    serve();
    watch('app/scss/**/*.scss', style);
    watch('app/images/*', imagesmini);
    watch('app/*.html').on('change', reload);
    // watch('app/js/*.js', script);
}