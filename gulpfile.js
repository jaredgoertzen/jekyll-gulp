// grab our packages
const gulp   = require('gulp'),
      postcss = require('gulp-postcss'),
      sass   = require('gulp-sass'),
      cssnext = require('postcss-cssnext'), //includes autoprefixer in build
      will_change = require('postcss-will-change'), 
      sourcemaps = require('gulp-sourcemaps');

// define the default task and add the watch task to it
gulp.task('default', ['watch']);

// compile scss partials
gulp.task('compile-scss', function() {
  var processors = [
    will_change, //always load before cssnext(autoprefixer) so it get prefixed properly
    cssnext
  ]

  return gulp.src('_dev/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('assets/css'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
  gulp.watch('_dev/scss/**/*.scss', ['compile-scss']);
});