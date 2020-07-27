var fs = require('fs')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const SERVERSCRIPT = "statici"
module.exports = class Build {


    constructor(src, eventName) {
        if (src == undefined)
            throw new Error("Source File not defined")
        if (eventName == undefined)
            this.eventName = "load"
        else
            this.eventName = eventName
        this.src = src;
        this._verifyFile();

    }
    async buildToFile(outputPath) {
        const result = await this._jsdomRender(outputPath);
        if (!result) {
            throw new Error("Somethings gone wrongs unable to render");
        } else {
            return true
        }
    }
    async buildToString() {
        const result = await this._jsdomRender();
        return result;

    }

    _verifyFile() {
        fs.open(this.src, 'r', (err, fd) => {
            if (err) {
                if (err.code == "ENOENT") {
                    throw new Error("We couldn't find the source file at " + this.src)
                }
            }
            fs.close(fd, (err) => {
                if (err) throw err;
            });
        });
    }

    async _jsdomRender(outputPath) {

        const options = {
            resources: 'usable',
            runScripts: 'dangerously',
        };
        return new Promise((resolve, reject) => {

            return JSDOM.fromFile(this.src, options).then((dom) => {
                if (this.eventName == "load") {
                    var html = dom.window.document.getElementsByTagName("html")[0].innerHTML
                    var scriptTags = dom.window.document.getElementsByTagName("script");
                    var toBeRemoved = []

                    for (var i = 0; i < scriptTags.length; i++) {

                        var script = scriptTags[i]

                        if (script.getAttribute(SERVERSCRIPT) && script.getAttribute(SERVERSCRIPT).toLowerCase() == "true") {
                            toBeRemoved.push(script)

                        }

                    }
                    if (i == scriptTags.length) {
                        toBeRemoved.forEach(elem => {
                            elem.remove()
                        });
                    }
                    html = dom.window.document.getElementsByTagName("html")[0].innerHTML
                    if (outputPath) {

                        fs.writeFileSync(outputPath, "<html>\n" + html + "\n</html>");
                        dom.window.document.removeEventListener('build', null);
                        dom.window.close();
                        return resolve(true)
                    } else {
                        dom.window.document.removeEventListener('build', null);
                        dom.window.close();
                        return resolve("<html>\n" + html + "\n</html>")
                    }

                } else {
                    return dom.window.document.addEventListener(this.eventName, () => {
                        var html = dom.window.document.getElementsByTagName("html")[0].innerHTML
                        var scriptTags = dom.window.document.getElementsByTagName("script");
                        var toBeRemoved = []

                        for (var i = 0; i < scriptTags.length; i++) {

                            var script = scriptTags[i]

                            if (script.getAttribute(SERVERSCRIPT) && script.getAttribute(SERVERSCRIPT).toLowerCase() == "true") {
                                toBeRemoved.push(script)

                            }

                        }
                        if (i == scriptTags.length) {
                            toBeRemoved.forEach(elem => {
                                elem.remove()
                            });
                        }
                        html = dom.window.document.getElementsByTagName("html")[0].innerHTML
                        if (outputPath) {

                            fs.writeFileSync(outputPath, "<html>\n" + html + "\n</html>");
                            dom.window.document.removeEventListener('build', null);
                            dom.window.close();
                            return resolve(true)
                        } else {
                            dom.window.document.removeEventListener('build', null);
                            dom.window.close();
                            return resolve("<html>\n" + html + "\n</html>")
                        }


                    })
                }
            })

        });


    }



}


