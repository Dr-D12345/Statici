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
    async buildToFile(outputPath, options = {}) {
        
        const result = await this._jsdomRender(outputPath, options);
        if (!result) {
            throw new Error("Somethings gone wrongs unable to render");
        } else {
            return result
        }
    }
    async buildToString(options = {}) {
        const result = await this._jsdomRender(null,options);
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
    setSrc(path) {
        this.src = path;
        this._verifyFile(path);
    }
    setEvent(eventName){
        this.eventName = eventName;
    }
    resetEvent(){
        this.eventName='load';
    }
    async _jsdomRender(outputPath, options) {

        const jsdomOp = {
            resources: 'usable',
            runScripts: 'dangerously',
        };
        return new Promise(async (resolve, reject) => {

            return JSDOM.fromFile(this.src, jsdomOp).then(async (dom) => {
                try {
                    if (options.data != null) {
                        var testEvent = dom.window.document.createEvent("Event");
                        testEvent.initEvent('statici', true, true);
                        testEvent.data = options.data;
                        dom.window.document.dispatchEvent(testEvent);
                    }
                    dom.window.document.addEventListener(this.eventName, async () => {
                        var html = await this._cleanup(dom);
                        if (outputPath) {
                            fs.writeFileSync(outputPath, "<html>\n" + html + "\n</html>");
                            dom.window.document.removeEventListener(this.eventName, null);
                            dom.window.close(); 
                            return resolve(outputPath.toString())
                        } else {
                            dom.window.document.removeEventListener(this.eventName, null);
                            dom.window.close();
                            return resolve("<html>\n" + html + "\n</html>");
                        }
                    });
                } catch (err) {
                    console.error(err);
                    return reject(err);
                }
            });
        });


    }
    _cleanup(dom) {
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
        var html = dom.window.document.getElementsByTagName("html")[0].innerHTML;
        
        return html;
    }



}


