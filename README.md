meteor-heapsave
===============

Take Heapdump and save them into S3

## Install

```
meteor add arunoda:heapsave
```

## Usage

```js
var heapsave = HeapSave.toS3('access-key', 'access-secret', 'bucket');

function saveHeap(){
	var saveName = 'myapp-' + Date.now();
  	heapsave(saveName);
}

// Save heapdump after 1 minute
Meteor.setTimeout(saveHeap, 1000*60);

// Save heapdumps every hour
Meteor.setInterval(saveHeap, 1000*60*60);
```

## Notice
* In order to get a heapdump you need to have at least twice of Memory on the system.
So it's better to turn on swap if you are running under a low memory server.
* Every heapdump will cause v8 to call `gc()`. It is a blocking operation.
* Heapdump will be saved to disk using a child_process.
* Heapdump will be compressed before sending it to s3. Compression also done via a child process.
* refer [node-heapdump](https://github.com/bnoordhuis/node-heapdump) project for more information

## Analyzing

Heapdumps can be analyzed using Chrome dev tools.

* download your dumps from s3
* untar them
* load them into chrome dev tool under "profiles" tab

![Loading Heapdump into Chrome Dev Tools](https://i.cloudup.com/-IruTOUNLq.gif)

* [learn](https://developer.chrome.com/devtools/docs/heap-profiling) how to analyze heap and detect memory leaks

## Contributors
Written by [Arunoda](https://github.com/arunoda) from [Kadira](https://kadira.io/).
Meteor 1.2 support added by the [Nitrolabs team](http://www.nitrolabs.com/).

