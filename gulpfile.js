var gulp = require("gulp")
  , sourcemaps = require("gulp-sourcemaps")
  , babel = require("gulp-babel")
  , concat = require("gulp-concat")
  , watch = require('gulp-watch')
  , jasmine = require('gulp-jasmine')
  , runSequence = require('run-sequence').use(gulp)

gulp.task("babel", function () {
  return gulp.src("src/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(babel())
    // .pipe(concat("index.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"));
});


gulp.task('test', function() {
	return gulp.src('dist/specs/unit.js')
		.pipe(jasmine())
})

gulp.task('default', function(done) {
    runSequence('babel', 'test', done);
})


gulp.task("babel-watch", function() {
	runSequence('default');
	return watch('./src/**/*.js', function() {
		runSequence('default');
	})
})