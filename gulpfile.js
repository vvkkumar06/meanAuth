const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

gulp.task('default', ()=>{
    nodemon({
        script: "app",
        ext: "js",
        env:{
            PORT: 8000
        },
        ignore: "./node_modules/**" 
    })
    .on('restart', ()=>{
        console.log("restarting...");
    });
});