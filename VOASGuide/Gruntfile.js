module.exports = function (grunt) {
	"use strict";
	grunt.loadNpmTasks("@sap/grunt-sapui5-bestpractice-build");
<<<<<<< Upstream, based on origin/master
	grunt.loadNpmTasks("@sap/grunt-sapui5-bestpractice-test");
=======
>>>>>>> 855f4c3 Added sapui5 best practice build process
	grunt.config.merge({
<<<<<<< Upstream, based on origin/master
		compatVersion: "1.63",
		clean: {
			distRoot: [
				"dist/*",
				"!dist/webapp/**"
			]
		},
		copy: {
			copyProjectFilesToDist: {
				files: [{
					src: "!*-app.json"
				}]
			},
			distRootToDistWebapp: {
				cwd: "dist",
				expand: true,
				src: [
					"**",
					"!webapp/**"
				],
				dest: "dist/webapp"
			},
			rootToDistRoot: {
				cwd: ".",
				expand: true,
				src: [
					"**",
					"!dist/**",
					"!webapp/**"
				],
				dest: "dist",
			}
		},
		mkdir: {
			distWebapp: {
				options: {
					create: ["dist/webapp"]
				}
			}
		},
		shell: {
			npmPrune: {
				cwd: "dist",
				command: "npm prune --production"
			}
		},
		coverage_threshold: {
			statements: 0,
			branches: 100,
			functions: 0,
			lines: 0
=======
		clean: {
			distRoot: [
				"dist/*",
				"!dist/webapp/**"
			]
		},
		copy: {
			copyProjectFilesToDist: {
				files: [{
					src: "!*-app.json"
				}]
			},
			distRootToDistWebapp: {
				cwd: "dist",
				expand: true,
				src: [
					"**",
					"!webapp/**"
				],
				dest: "dist/webapp"
			},
			rootToDistRoot: {
				cwd: ".",
				expand: true,
				src: [
					"**",
					"!dist/**",
					"!webapp/**"
				],
				dest: "dist",
			}
		},
		mkdir: {
			distWebapp: {
				options: {
					create: ["dist/webapp"]
				}
			}
		},
		shell: {
			npmPrune: {
				cwd: "dist",
				command: "npm prune --production"
			}
>>>>>>> 855f4c3 Added sapui5 best practice build process
		}
	});
	grunt.loadNpmTasks("grunt-shell");
	grunt.registerTask("updateDistToNodeJsStructure", [
		"mkdir:distWebapp",
		"copy:distRootToDistWebapp",
		"clean:distRoot",
		"copy:rootToDistRoot",
		"shell:npmPrune"
	]);
	grunt.registerTask("default", [
		"clean",
		"lint",
		"build",
		"updateDistToNodeJsStructure"
	]);
<<<<<<< Upstream, based on origin/master
	grunt.registerTask("unit_and_integration_tests", [
		"test"
	]);
=======
>>>>>>> 855f4c3 Added sapui5 best practice build process
};