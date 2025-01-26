const gulp = require('gulp');
const source = require("vinyl-source-stream");
const rollup = require('@rollup/stream');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const del = require('del');
const { exec } = require('child_process');

// Build for Google Chrome first, then copy for Firefox and update manifest
const dist = './dist';
const distChrome = `${dist}/chrome`;
const distFirefox = `${dist}/firefox`;

const scripts = [
    { name: 'Background', input: './src/background.js', source: 'background.js', dest: distChrome },
    { name: 'Handler', input: './src/handler.js', source: 'handler.js', dest: distChrome },
    { name: 'Options', input: './src/options.js', source: 'options.js', dest: distChrome }
];

gulp.task('clean', () =>
    del.deleteAsync([`${dist}/**/*`, `${dist}/.*`, './web-ext-artifacts/']));

gulp.task('copyCss', () =>
    gulp.src('./static/css/*.css')
    .pipe(gulp.dest(`${distChrome}/css`)));

gulp.task('copyIcons', () =>
    gulp.src('./static/icons/*.png', { encoding: false })
    .pipe(gulp.dest(`${distChrome}/icons`)));

gulp.task('copyOptions', () =>
    gulp.src('./static/options/*.html')
    .pipe(gulp.dest(`${distChrome}/options`)));

gulp.task('copyManifest', () =>
    gulp.src('./static/manifest.json')
    .pipe(gulp.dest(distChrome)));

// Create a build task for each script
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

// Stage everything for Firefox and update the manifest
gulp.task('copyDistForFirefox', () =>
    gulp.src(`${distChrome}/**`, { encoding: false })
    .pipe(gulp.dest(distFirefox)));

gulp.task('convertManifestForFirefox', () =>
    exec('convert-manifest-format --firefox', { cwd: distFirefox }, (error, stdout, stderr) => {
        if (error) {
            throw new Error(`exec error: ${error}`);
        }
    })
);

gulp.task('buildChrome', gulp.series('copyCss', 'copyIcons', 'copyOptions', 'copyManifest', ...scriptTasks));
gulp.task('buildFirefox', gulp.series('copyDistForFirefox', 'convertManifestForFirefox'));
gulp.task('build', gulp.series('buildChrome', 'buildFirefox'));
gulp.task('default', gulp.series('build'));
