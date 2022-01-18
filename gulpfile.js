const {  src, dest, watch, parallel, series  } = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const sync = require("browser-sync").create();
const concat = require('gulp-concat');
const minifyCSS = require('gulp-minify-css');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

function bundleCssV(){
  return src('dist/css/vendor/**/*.css')
    .pipe(cleanCSS({
      debug: true,
      compatibility: 'ie8',
      level: {
        1: {
          specialComments: 0,
        },
      },
    }))
    .pipe(minifyCSS())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions'],
        cascade: false
      }))
    .pipe(concat('style.vendor.min.css'))
    .pipe(dest('dist/css/vendor/bundles'))
}

function bundleCssC(){
  return src('dist/css/client/**/*.css')
    .pipe(cleanCSS({
      debug: true,
      compatibility: 'ie8',
      level: {
        1: {
          specialComments: 0,
        },
      },
    }))
    .pipe(minifyCSS())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('style.client.min.css'))
    .pipe(dest('dist/css/client/bundles'))
}


function generateCSS(cb) {
  src('assets/scss/client/**.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('dist/css/client/'));
  cb();
  src('assets/scss/vendor/**.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('dist/css/vendor/'));
  cb();
}


function watchFiles(cb) {
  watch('assets/scss/vendor/**.scss', generateCSS);
  watch('assets/scss/client/**.scss', generateCSS);
  watch([ '**/*.js', '!node_modules/**']);
}

function browserSync(cb) {
  sync.init({
    server: {
      baseDir: "./"
    }
  });

  watch('assets/scss/vendor/**.scss', generateCSS).on('change', sync.reload);
  watch('assets/scss/client/**.scss', generateCSS).on('change', sync.reload);
  watch("./**.html").on('change', sync.reload);
  watch('dist/css/**/client/*.css').on('change',bundleCssC);
  watch('dist/css/**/vendor/*.css').on('change',bundleCssV);
}

exports.sync = browserSync;
exports.css = generateCSS;
exports.watch = watchFiles;
exports.default = series(parallel(generateCSS));
