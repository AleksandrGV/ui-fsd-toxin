
const {src, dest, watch, series} = require('gulp');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const minifyJs = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const sync = require('browser-sync').create();
const del = require('del');

// HTMLmin

const htmlMin = () => {
  return src("source/*.html")
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(dest("public"));
};

// Styles

function styles() {
  const newLocal = [
    "last 2 versions",
  ];
  return src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass({outputStyle: "expanded"}))

    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(rename("style.css"))
    .pipe(dest("public/css/"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(dest("public/css/"))
    .pipe(sync.stream());
};

// Min JS

const minjs = () => {
  return src("source/js/script.js")
    .pipe(minifyJs())
    .pipe(rename("script.min.js"))
    .pipe(dest("public/js"))
};

// Imagesmin

const images = () => {
  return src("source/img/**/*.{jpg, png, svg}")
    .pipe(imagemin([
      imagemin.mozjpeg({ optimizationLevel: 3}),
      imagemin.optipng({ progressive: true}),
      imagemin.svgo()
    ]))
};

// Webp

const createWebp = () => {
  return src("source/img/**/*.{jpg, png}")
    .pipe(webp({ quality: 90 }))
    .pipe(dest("source/img"))
};

// SVGSprite

const sprite = () => {
  return src("source/img/**/icon-*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(dest("public/img"))
};

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "public"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

// Watcher

const watcher = () => {
  watch("source/sass/**/*.scss", series("styles"));
  watch("source/*.html").on("change", sync.reload);
};

// Clean

const clean = () => {
  return del(["public"]);
};

// Copy

const copy = () => {
  return src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**/!(icon-*)",
    "source/js/**",
    "source/*.ico"
  ], {
    base: "source"
  })
  .pipe(dest("public"));
};


exports.htmlMin = htmlMin;
exports.styles = styles;
// exports.minjs = minjs;
exports.images = images;
exports.webp = createWebp;
// exports.sprite = sprite;
// exports.clean = clean;

// Public

const public = series (
  clean,
  copy,
  styles,
  sprite,
  minjs,
  htmlMin
);

exports.public = public;

exports.default = series(
  public, server, watcher
);

