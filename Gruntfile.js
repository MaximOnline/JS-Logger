module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        'saucelabs-custom':{
            all:{
                options:{
                    //username: 'klond90', // if not provided it'll default to ENV SAUCE_USERNAME (if applicable)
                    //key: 'saucelabs-key', // if not provided it'll default to ENV SAUCE_ACCESS_KEY (if applicable)
                    urls: ['somenamedevteam.github.io/JS-Logger/tests/example_cache.html'],
                    build: process.env.CI_BUILD_NUMBER,
                    testname: 'Test Catch Errors',
                    browsers: [
                        ["Windows 8", "internet explorer", "10"],
                        ["OS X 10.10", "safari", "8"],
                        ["OS X 10.9", "safari", "7"],
                        ["Windows 7", "internet explorer","8"],
                        ["Windows 7", "internet explorer","9"],
                        ["Windows 7", "internet explorer","10"],
                        ["Windows 7", "firefox", "35"],
                        ["Windows 7", "firefox", "30"],
                        ["Windows 7", "firefox", "20"],
                        ["Windows 7", "chrome", ""],
                        ["Windows XP", "internet explorer", "8"],
                        ["OS X 10.10", "iPhone", "8.0"],
                        ["OS X 10.10", "iPhone", "8.1"]
                    ]
                }
            }
        }
    });
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-saucelabs');
    // Default task(s).
    grunt.registerTask('default', ['saucelabs-custom']);
};