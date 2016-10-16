/*criar variavel gulp e atribuir o required com o nome para o node_modules ser lido*/
var gulp = require('gulp'),
	imagemin = require('gulp-imagemin'), //plugin minificador
	clean = require('gulp-clean'), //apaga dist
	concat = require('gulp-concat'),
	htmlReplace = require('gulp-html-replace'), //substitui vários js por um
	uglify = require('gulp-uglify'), //minificador
	usemin =require('gulp-usemin'), //faz repetições de tarefas
	cssmin = require('gulp-cssmin'), //mimifica css
	browserSync = require('browser-sync'), //watchfile
	jshint = require('gulp-jshint'),
	// jshintStylish = require('gulp-jshintStylish'),
	csslint = require('gulp-csslint');

//tarefa para chamar tudo
gulp.task('default', ['copy'], function() {

	return gulp.start('build-img', 'usemin');
});

/*copia src para dist*/
//clean vira dependência de copy
gulp.task('copy', ['clean'], function() {
	//return para o copy sinalizar que está sendo executado
	return gulp.src('src/**/*') //cp ** = todos os diretorios * = todos os arquivos
		.pipe(gulp.dest('dist'));
});

/*tarefa para apagar pasta dist*/
gulp.task('clean', function() {
	//fluxo deve ser retornado para avisar que o clean está executando e
	//pede para esperar com o return
	return gulp.src('dist').pipe(clean());//chama o proprio clean
});

/*tarefa de execucao de minimage*/
gulp.task('build-img', function() {
	/*origem da pasta que desejo ler*/
	gulp.src('dist/img/**/*') //glob parttern da pasta img todos os arquivos da pasta
		/*fluxo de mimificacao*/
		.pipe(imagemin()) //inicia o plugin imagemin
		.pipe(gulp.dest('dist/img')); //destino onde será gravado após realizar o trabalho
});

//ler htmls, concatenar, mimificar, agrupar
//com comentários condicionais
//usemin le arquivos html, extrai os arquivos que tem o comentário
//e mimifica eles
gulp.task('usemin', function() {
	gulp.src('dist/**/*.html')
	.pipe(usemin({
		'js' : [uglify],
		'css' : [cssmin]
	}))
	.pipe(gulp.dest('dist'));
});

//watch, hint
gulp.task('server', function() {
	browserSync.init({

		server: {
			baseDir: 'src'
		}
	});

	//verifica e checa o parametro
	gulp.watch('src/js/*.js').on('change', function(event) {
		gulp.src(event.path) //passa o path
		.pipe(jshint()) //mostra erro
		// .pipe(jshint.reporter(jshintStylish)); //nec para mostrar erros
		.pipe(jshint.reporter());
	});

	// //verifica e checa o parametro
	// gulp.watch('src/css/*.css').on('change', function(event) {
	// 	gulp.src(event.path) //passa o path
	// 	.pipe(csslint()) //mostra erro
	// 	.pipe(csslint.reporter()); //nec para mostrar erros
	// });

	gulp.watch('src/**/*').on('change', browserSync.reload);
});
