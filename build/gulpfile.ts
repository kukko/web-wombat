import gulp, { series } from "gulp";
import ts from "gulp-typescript";
import { exec } from "child_process";

gulp.task("clean", () => {
  return exec("npx rimraf dist", {
    cwd: ".",
  });
});

gulp.task("compile-ts", () => {
  const tsProject = ts.createProject('tsconfig.json');
  return gulp.src("src/**/*.ts").pipe(tsProject()).pipe(gulp.dest("dist"));
});

gulp.task("copy-files", () => {
  return gulp.src("src/**/*.js").pipe(gulp.dest("dist"));
});

gulp.task("default", series("clean", "compile-ts", "copy-files"));
