module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        'saucelabs-custom':{
            all:{
                options:{
                    username: 'klond90', // if not provided it'll default to ENV SAUCE_USERNAME (if applicable)
                    key: 'saucelabs-key', // if not provided it'll default to ENV SAUCE_ACCESS_KEY (if applicable)
                    urls: ['/tests/example_cache.html'],
                    build: process.env.CI_BUILD_NUMBER,
                    testname: 'Check Errors',
                    browsers: [{
                        browserName: 'firefox',
                        version: '19',
                        platform: 'XP'
                    }]
                }
            }
        }
    });
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-saucelabs');
    // Default task(s).
    grunt.registerTask('default', ['saucelabs-custom']);
};