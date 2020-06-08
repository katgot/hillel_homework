let project_folder = "dist";
let source_folder = "src";

let path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
  },
  src: {
    html: source_folder + "/*.html",
    css: source_folder + "/less/main.less",
    js: source_folder + "/js/main.js",
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/less/**/*.less",
    js: source_folder + "/js/**/*.js",
  },
  clean: "./" + project_folder + "/",
};

let { src, dest } = require("gulp");
let gulp = require("gulp");
let browsersync = require("browser-sync").create();
let fileinclude = require("gulp-file-include");
let del = require("del");
let less = require("gulp-less");
let babel = require("gulp-babel");

function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/",
    },
    notify: false,
  });
}

function html() {
  return (
    src(path.src.html)
      // .pipe(fileinclude())
      .pipe(dest(path.build.html))
      .pipe(browsersync.stream())
  );
}

function watchFiles(params) {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
}

function clean(params) {
  return del(path.clean);
}

function css() {
  return src(path.src.css)
    .pipe(less())
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function js() {
  return (
    src(path.src.js)
      .pipe(
        babel({
          presets: ["@babel/preset-env"],
        })
      )
      // .pipe(fileinclude())
      .pipe(dest(path.build.js))
      .pipe(browsersync.stream())
  );
}

let build = gulp.series(clean, gulp.parallel(js, css, html));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;

// const { watch, series, src, dest } = require('gulp');
// const fs = require('fs');
// const browserSync = require('browser-sync');
// const less = require('gulp-less');

// function server(){
//     browserSync({
//         server: {
//             baseDir: 'dist'
//         },
//         notify: false
//     })
// }

// const gulp = require("gulp");
// const less = require("gulp-less");
// const browserSync = require("browser-sync");

// gulp.task("less", function () {
//   return gulp
//     .src("app/less/main.less")
//     .pipe(less())
//     .pipe(gulp.dest("app/css"))
//     .pipe(browserSync.reload({ stream: true }));
// });

// gulp.task("watch", function () {
//   gulp.watch("app/less/main.less", gulp.series("less"));
// });

// gulp.task("watch", function () {
//     gulp.watch("app/less/main.less", function(){
//         return src("app/less/main.less")
//         .pipe(browserSync.reload({ stream: true }));
//     });
//   });

// function watchFiles(){
//     watch("app/less/main.less", function(){
//         return src("app/less/main.less")
//         .pipe(browserSync.reload({ stream: true }));
//     });
// };

// gulp.task("browser-sync", function () {
//   browserSync({
//     server: {
//       baseDir: "app",
//     },
//     notify: false,
//   });
// });

// Static Server + watching scss/html files
// gulp.task("serve", ["less"], function () {
//   browserSync.init({
//     server: "app",
//     // server: "./app"
//   });

//   gulp.watch("app/less/*.less", ["less"]);
//   gulp.watch("app/*.html").on("change", browserSync.reload);
// });

// Compile sass into CSS & auto-inject into browsers

// gulp.task("default", ["serve"]);

// gulp.task('default', gulp.series('css', 'server', (done) => {

//     // изменение изображений
//     gulp.watch(imgConfig.src, gulp.series('images'));

//     // изменение CSS
//     gulp.watch(cssConfig.watch, gulp.series('css'));

//     done();

//   }));
