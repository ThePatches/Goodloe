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
                    dest: "build/",
                    ext: ".min.js",
                    extDot: "first",
                    flatten: true,
                    rename: function(dest, src)
                    {
                        if (src.indexOf("controller") > 0)
                        {
                            return dest + "controllers.js";
                        } else if (src.indexOf("directive") > 0 )
                            return dest + "directives.js";
                        else return dest + src;
                    }
                }]
            }
        },

        jshint: {
            files: ["public/js/controllers/*.js"],
            options:
            {
                globals:
                {
                    jQuery: true
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.registerTask('default', ['jshint','uglify']);
};