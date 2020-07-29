# Statici
A way to eliminate network requests before their needed


## Installation


```
npm i statici
```
## Usage
_Why should you even use this_

The purpose of this library is to provide a way to render client side javascripts requests on the server to reduce load time. Giving the benefit of static delivery with dynamic data. This package is primarily for vanila html projects with a mild to low update frequency and has not been tested on rapid updating projects.

**Give all scripts that are to be run and removed the attribute 'statici="true"'**
``` html
<script statici="true">console.log("I wont be here")</script>
```

``` html
<script>
    dom.addEventListener('customEvent', (evt)=>{
        console.log("I am from the server "+evt.data)
    })
</script>
```


## Example

*index.js*

``` javascript

const Statici = require("statici")
var build = new Statici('./src-file-directory.html', "build")
await build.buildToFile("./output-path/out.html",{data:"hello from the server"})
```

*src-file-directory.html*

```html
<html>
    <body>
    <script statici="true">
        const event = new Event('build'); 
                window.addEventListener("statici", (evt)=>{
            document.getElementById("console").innerHTML =JSON.stringify(evt.data)
        })
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
        <p id="console"></p>
    </body>
    </html>
```

*./output-path/out.html*

```html
<html>
    <body>

        <p id="demo">2020-07-27T04:02-04:00</p>
        <p id="console">hello from the server</p>
    </body>
    </html>
```


## API

### Statici(src, eventName)


#### parameters
- src
    - type: string
    - source file directory path
- eventName _optional_
    - type: string
    - The name of the event when the page is loaded
    - if empty will use load

#### return
  - type: Statici class

#### example

``` html
  const build =  new Statici("sample.html",'build')
  ```

### .setSrc(src)

####  parameters
- src
  - type: string
  - source file directory path

#### example

``` html
build.setSrc("newSrc.html")
```

### .setEvent(event)

#### parameters
  - event 
    - type: string
    - The name of the event when the page is loaded

#### example

``` html
build.setEvent('build')
```
### .buildToFile(element, options)

#### parameters

- element
    - type: string
    - output file directory path
- options _optional_
    - type: json
    - _required_
      - data
        - type: any
        - the place to store custom data for the front end

#### return 
  - Type: string
  - output file path

#### example

``` html
    build.buildToFile("output.html",{data:"this will be passed to the front end"})
```

### .buildToString(options)

#### parameters
- options _optional_
    - type: json
    - _required_
      - data
        - type: any
        - the place to store custom data for the front end

#### return 
  - type: string 
  - The rendered html file as a string

#### example

``` html
    build.buildToString("output.html",{data:"this will be passed to the front end"})
```
