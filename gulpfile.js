const gulp = require('gulp');
const source = require("vinyl-source-stream");
const rollup = require('@rollup/stream');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const del = require('del');

const dist = './dist';

const scripts = [
    { name: 'Background', input: './src/background.js', source: 'background.js', dest: dist },
    { name: 'Handler', input: './src/handler.js', source: 'handler.js', dest: dist },
    { name: 'Options', input: './src/options.js', source: 'options.js', dest: dist }
];

gulp.task('clean', () =>
    del.deleteAsync([`${dist}/**/*`, `${dist}/.*`, './web-ext-artifacts/']));

gulp.task('copyCss', () =>
    gulp.src('./static/css/*.css')
    .pipe(gulp.dest("./dist/css")));

gulp.task('copyIcons', () =>
    gulp.src('./static/icons/*.png', { encoding: false })
    .pipe(gulp.dest("./dist/icons")));

gulp.task('copyOptions', () =>
    gulp.src('./static/options/*.html')
    .pipe(gulp.dest("./dist/options")));

gulp.task('copyManifest', () =>
    gulp.src('./static/manifest.json')
    .pipe(gulp.dest("./dist")));

let scriptTasks = [];

scripts.forEach((script) => {
    const taskName = `build${script.name}`;

    gulp.task(taskName, () =>
        rollup({
            input: script.input,
            output: { sourcemap: false, format: 'iife', name: script.name },
            plugins: [ resolve(), commonjs() ]
        })
        .pipe(source(script.source))
        .pipe(gulp.dest(script.dest)));

    scriptTasks.push(taskName);
});

gulp.task('build', gulp.series('copyCss', 'copyIcons', 'copyOptions', 'copyManifest', ...scriptTasks));

gulp.task('default', gulp.series('build'));