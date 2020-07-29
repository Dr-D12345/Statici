var Build = require("../src/index")

var buld = new Build("./test/view/test.html",'build')
build()

async function build() {

    var file = await buld.buildToString({data:'hello'})
    console.log("file1: "+file)
    buld.setSrc("./test/view/nothing.html")
    buld.setEvent('load')
    var file2 = await buld.buildToString({data:"hi2"})
    console.log("file2: "+file2)
    //var html2 = await buld.buildToString();
    // if(html && html2){
    //    console.log("test passed");
    //TODO acutally get some testing
    //}
}

