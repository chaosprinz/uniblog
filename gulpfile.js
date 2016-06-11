'use strict'

const gulp = require('gulp')
const GulpQuire = require('require-gulp-tasks')
const Join = require('path').join
const Mocha = require('gulp-mocha')

const CWD = process.cwd()
const TASK_MODULES = [
  'unijas-task-runserver',
  'unijas-task-buildjs',
  'unijas-task-build-stylus'
]

TASK_MODULES.forEach((taskModule) => GulpQuire(taskModule, gulp))

gulp.task('test:api', function () {
  return gulp.src(Join(CWD, 'test', 'api', '**', '*.js'))
  .pipe(Mocha({ ui: 'bdd', reporter: 'spec' }))
})

gulp.task('watch', function () {
  gulp.watch(Join(CWD, 'src', '**', '*.j*'), ['buildjs:client'])
  gulp.watch(Join(CWD, 'src', 'app', 'component', '**', '*.styl'), ['stylus'])
  gulp.watch(Join(CWD, 'src', 'api','**', '*.js'), ['test:api'])
  gulp.start('runserver:dev')
})

gulp.task('default', ['buildjs:vendor', 'buildjs:client', 'watch'])
