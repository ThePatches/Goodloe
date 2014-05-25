/**
 * Created by Patrick Taylor on 5/24/14.
 */

module.exports = function(grunt)
{
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        uglify:
        {
            options:
            {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            },
            /*build: {
                src: 'models/*',
                dest: 'build/stuff.min.js'
            }*/
            dynamic_mappings:
            {
                files: [{
                    expand: true,
                    cwd: "public/js/",
                    src: ["controllers/*.js", "directives/*.js", "*.js"],
                    dest: "build/public/js/",
                    ext: ".min.js",
                    extDot: "first",
                    flatten: true,
                    rename: function(dest, src)
                    {
                        if (src.indexOf("controller") > 0)
                        {
                            return dest + "controllers.min.js";
                        } else if (src.indexOf("directive") > 0 )
                            return dest + "directives.min.js";
                        else return dest + src;
                    }
                }]
            }
        },

        jshint: {
            files: ["public/js/controllers/*.js", "public/js/directives/*.js", "public/js/app.js", "controllers/*", "models/*"],
            options:
            {
                globals:
                {
                    jQuery: true
                }
            }
        },

        copy: {
            main: {
                files: [
                    {src: "public/index2.html", dest: "build/public/index.html"},
                    {src: "public/error.html", dest: "build/public/error.html"},
                    {expand: true, cwd: "public/", src: "views/*", dest: "build/public/", filter: 'isFile'},
                    {expand: true, cwd: "public/js/", src: "libs/**", dest: "build/public/js/", filter: 'isFile'},
                    {expand: true, cwd: "public/", src: "styles/*", dest: "build/public/"}
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks(("grunt-contrib-copy"));
    grunt.registerTask('default', ['jshint','uglify', 'copy']);
};