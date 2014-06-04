module.exports = function(grunt) {
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		minCSS: 'stylesheets/engage.min.css',
		local_settings: {
			local_url: ''
        },
		concat : {
			css: {
				options: {
					banner: '/* <%= pkg.name %> combined file generated @ <%= grunt.template.today("dd-mm-yyyy") %> */\n'
				},
				files: {
					'stylesheets/engage.css' : ['stylesheets/main.css','stylesheets/form.css']
				}
			}
		},

		cssmin: {
			options: {
				banner: '/*! <%= pkg.name %> minified CSS file generated @ <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			css: {
				files: {
					'<%= minCSS %>' : [ 'stylesheets/engage.css' ]
				}
			}
        },

        clean: {
			combinedcss: {
				src: ['stylesheets/engage.css']
			},
			mincss: {
				src: ['<%= minCSS %>']
			},
			revcss: {
				src: ['stylesheets/*engage.min.css']
			},
			jsrev: {
				src: ['javascripts/*engage.min.js']
			},
			minjs: {
				src: ['javascripts/engage.min.js']
			}
		},

        rev: {
			css: {
				files: {
					src: ['<%= minCSS %>']
				}
			},
			js: {
				files: {
					src: ['javascripts/engage.min.js']
				}
			}
		},

		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				globals: {
					jQuery: true
				},
			},
			all: ['Gruntfile.js', 'javascripts/main.js']
		},

		uglify : {
			js: {
				files: {
					'javascripts/engage.min.js' : [ 'javascripts/main.js' ]
				}
			}
		},

		removelogging: {
			dist: {
				src: 'javascripts/engage.min.js',
				dest: 'javascripts/engage.min.js'
			}
		},

		watch: {
			js: {
				files: ['javascripts/main.js'],
				tasks: ['js']
			},
			css: {
				files: [
					'stylesheets/form.css',
					'stylesheets/main.css'
				],
				tasks: ['css']
			},
			cfcs: {
				files: ['cfcs/*.cfc'],
				tasks: ['http_watcher']
			}
		},

		injector: {
			options: {},
			css: {
				files: {
					'layout.cfm': ['stylesheets/*engage.min.css'],
				}
			},
			js: {
				files: {
					'layout.cfm': ['javascripts/*engage.min.js'],
				}
			}
		},

		http: {
			reload: {
				options: {
					url: '<%= local_settings.local_url %>'
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-remove-logging');
    grunt.loadNpmTasks('grunt-http');
	grunt.loadNpmTasks('grunt-injector');
	grunt.loadNpmTasks('grunt-rev');

	grunt.registerTask('css', ['clean:revcss', 'concat:css', 'cssmin:css', 'clean:combinedcss', 'rev:css', 'clean:mincss', 'injector:css']);
    grunt.registerTask('js', ['jshint', 'clean:jsrev', 'uglify:js', 'removelogging', 'rev:js', 'clean:minjs', 'injector:js']);

	grunt.registerTask('default', ['checklocalconf']);

	grunt.registerTask('http_watcher', 'Set the local url before running http:reload', function() {
		var jsonLocalSettings = grunt.file.readJSON("grunt_local_settings.json");
		grunt.config.set('local_settings', jsonLocalSettings);
		grunt.config.requires('local_settings');
		grunt.task.run('http:reload');
    });

    grunt.registerTask('checklocalconf', 'Check if the local config JSON file exists', function(arg) {
		if(grunt.file.exists('grunt_local_settings.json')) {
			grunt.task.run('watch');
		} else {
			grunt.log.errorlns('');
			grunt.log.errorlns('The grunt_local_settings.json file does not appear to exist.');
			grunt.log.errorlns('Please create it in this directory with the following content (the URL for your local reload.cfm file):');
			grunt.log.errorlns('');
			grunt.log.errorlns('{');
			grunt.log.errorlns('	"local_url": "http://your_local_server/reload.cfm"');
			grunt.log.errorlns('}');
			grunt.log.errorlns('');
			grunt.fail.fatal('Please create and save the grunt_local_settings.json file then re-run this command.');
		};
	});

};