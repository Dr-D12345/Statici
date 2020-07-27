# Statici
A way to eliminate network requests before their needed

## Usage
_Why should you even use this_

This package is primarily for vanila html projects with a mild to low update frequency and has not been tested on rapid updating projects.

**Give all scripts that are to be run and removed the attribute 'statici="true"'**

## Example

*index.js*
``` javascript

const Statici = require("statici")
var build = new Statici('./src-file-directory.html', "build")
await build.buildToFile("./output-path/out.html')
```
*src-file-directory.html*
```html
<html>
    <body>
    <script statici="true">
        const event = new Event('build'); 
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
                var doc = document.getElementById("demo");
                var jsonDoc = JSON.parse(xmlHttp.responseText);
                doc.innerHTML=jsonDoc['currentDateTime'];
                document.dispatchEvent(event);
            }
           
        }
        xmlHttp.open("GET", 'http://worldclockapi.com/api/json/est/now', true);
        xmlHttp.send(null);
        </script>
        <p id="demo"></p>
    </body>
    </html>
```
*./output-path/out.html*
```html
<html>
    <body>

        <p id="demo">2020-07-27T04:02-04:00</p>
    </body>
    </html>
```


## API

**Statici(src, eventName)**
- src
    - type: string
    - source file directory path
- eventName
    - type: string
    - The name of the event when the page is loaded
    - if empty will use load
- output
    - type: Statici class

**.buildToFile(element)**
- element
    - type: String
    - output file directory path
- output (optional)
    - Type: bool
    - true if successful

**.buildToString()**
- output 
    - type:string 
    - The rendered html file as a string