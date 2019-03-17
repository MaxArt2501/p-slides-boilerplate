const { readFileSync } = require('fs');
const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const tap = require('gulp-tap');
const cleanCSS = require('gulp-clean-css');
const rimraf = require('rimraf');
const browserSync = require('browser-sync');

async function reload() {
  return browserSync.reload();
}

function slides() {
  return src('src/presentations/**/*.html')
    .pipe(tap(file => {
      const html = file.contents.toString();
      const parsed = html
        .replace(
          /\bslide:(.+?)\s/g,
          (m, source) => {
            try {
              const slide = readFileSync(`src/slides/${source}.html`, 'utf-8');
              return slide;
            } catch (e) {
              console.error(`Slide not found: ${source}`);
              return m;
            }
          }
        );
      file.contents = Buffer.from(parsed);
    }))
    .pipe(dest('public'));
}
exports.slides = slides;
exports['slides+reload'] = series(slides, reload);

function css() {
  return src('src/styles/*.scss', { sourcemaps: true })
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(dest('public/css'), { sourcemaps: true })
    .pipe(browserSync.stream());
}
exports.css = css;

function js() {
  // No compilation provided, just use ES modules.
  // Provide your own compilation if you want, though.
  return src('src/js/**/*.js')
    .pipe(dest('public/js'));
}
exports.js = js;
exports['js+reload'] = series(js, reload);

const assets = () => src('static/**/*').pipe(dest('public'));
const vendors = () => src([
    'node_modules/p-slides/components/**/*.js',
    'node_modules/p-slides/*.js',
    'node_modules/p-slides/css/**/*.css'
  ], { base: './node_modules' })
  .pipe(dest('public/vendor'));
exports.static = parallel(assets, vendors);
exports['static+reload'] = series(exports.static, reload);

const clean = async () => rimraf.sync('public');
exports.clean = clean;

exports.default = parallel(
  exports.static,
  exports.css,
  exports.slides,
  exports.js
);

exports.serve = series(exports.default, () => {
  browserSync.init({
    ghostMode: false,
    server: {
      baseDir: './public'
    }
  });

  watch('src/styles/**/*.scss', exports.css);
  watch('src/{presentations,slides}/**/*.html', exports['slides+reload']);
  watch('src/js/**/*.js', exports['js+reload']);
  watch('static/**/*', exports['static+reload']);
});

exports['watch:css'] = function watchCss() {
  return watch('src/styles/**/*.scss', exports.css);
};
exports['watch:slides'] = function watchSlides() {
  return watch('src/{presentation,slides}/*.html', exports.slides);
};
exports['watch:static'] = function watchStatic() {
  return watch([ 'static/**/*' ], exports.static);
};

exports.watch = parallel(
  exports['watch:static'],
  exports['watch:css'],
  exports['watch:slides']
);
