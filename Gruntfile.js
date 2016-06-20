/*jshint node:true */
module.exports = function ( grunt ) {
	grunt.loadNpmTasks( 'grunt-contrib-less' );
	grunt.loadNpmTasks( 'grunt-contrib-csslint' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks('grunt-contrib-qunit');

	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),
		less: {
			site: {
				files: {
					'dist/wpnot.css': 'src/less/wpnot.less'
				}
			}
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			site: [
				'dist/wpNotifs.css'
			]
		},
		jshint: {
			options: {
				jshintrc: true
			},
			all: [
				'*.js',
				'src/js/**/*.js',
				'!node_modules/**'
			]
		},
		concat: {
			modules: {
				// options: {
				// 	banner: grunt.file.read( 'build/banner.txt' )
				// },
				files: {
					'dist/wpnot.redux.js': [
						'src/redux/wpnot.js',
						'src/redux/constants.js',
						'src/redux/helpers.js',
						'src/redux/actions.js',
						'src/redux/reducer.notifications.js',
						'src/redux/reducer.sources.js',
						'src/redux/reducer.api.js',
						'src/redux/reducer.count.js',
						'src/redux/reducer.combined.js'
					],
					'dist/wpnot.react.jsx': [
						'src/react/wpnot.react.jsx',
					]
				}
			}
		},
		qunit: {
			all: [ 'tests/index.html' ]
		}
	} );

	grunt.registerTask( 'default', [ 'lint', 'build' ] );
	grunt.registerTask( 'test', [ 'qunit' ] );
	grunt.registerTask( 'lint', [ 'csslint' ] );
	grunt.registerTask( 'build', [ 'less', 'concat' ] );
};
