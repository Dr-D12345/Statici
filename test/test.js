var Build = require("../src/index")

var buld =  new Build("./test/view/test.html",'build')
build()

async function build(){
    var html = await buld.buildToFile("./test/out/output.html");
    var html2 = await buld.buildToString();
    if(html && html2){
        console.log("test passed");
        //TODO acutally get some testing
    }
}

