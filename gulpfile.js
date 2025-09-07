const gulp = require('gulp');
const { watch, series, src, dest } = gulp;
const sass = require('gulp-sass')(require('sass'));
const minify = require('gulp-minify');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

// -------------------------
//  Styles
// -------------------------
function styles() {
  return src('app/scss/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ includePaths: ['node_modules/foundation-sites/scss'], quietDeps: true }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./maps'))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}

// -------------------------
//  Scripts
// -------------------------
function scripts() {
  return src(['app/js/*.js', 'app/js/vendor/*.js'])
    .pipe(minify({ ext: { min: '.js' }, noSource: true }))
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
}

// -------------------------
//  Images
// -------------------------
function images() {
  return src('app/images/**/*')
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({ plugins: [{ removeViewBox: false }, { cleanupIDs: false }] })
    ]))
    .pipe(dest('app/images/min'))
    .pipe(browserSync.stream());
}

// -------------------------
//  HTML Reload
// -------------------------
function html(done) {
  browserSync.reload();
  done();
}

// -------------------------
//  Serve + Watch
// -------------------------
function serve() {
  browserSync.init({ server: { baseDir: 'app' } });

  watch('app/scss/**/*.scss', styles);
  watch('app/js/**/*.js', scripts);
  watch('app/images/**/*', images);
  watch('app/**/*.html', html);
}

// -------------------------
//  Tasks
// -------------------------
exports.build = series(styles, images, scripts);
exports.default = serve;