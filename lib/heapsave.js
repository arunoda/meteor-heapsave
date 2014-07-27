var heapdump = Npm.require('heapdump');
var fs = Npm.require('fs');
var knox = Npm.require('knox');
var path = Npm.require('path');
var exec = Npm.require('child_process').exec;
var format = Npm.require('util').format;
var Fiber = Npm.require('fibers');

HeapSave = {
  toS3: function(key, secret, bucket, interval) {
    var s3Client = knox.createClient({
      key: key,
      secret: secret,
      bucket: bucket
    });

    s3PutFile = Meteor._wrapAsync(s3Client.putFile.bind(s3Client));

    return function doProcess(name) {
      name = name || Date.now();

      var filename = takeDump(name);
      var tarName = compressIt(filename);
      var res = s3PutFile(tarName, path.basename(tarName));
      res.resume();

      deleteFile(filename);
      deleteFile(tarName);
    };

    return Meteor.bindEnvironment(doProcess, function(err) {
      console.log('error when heapsave: ', err.stack);
    });
  }
};

takeDump = Meteor._wrapAsync(function (name, callback) {
  var filename = '/tmp/' + name + '.heapdump';
  heapdump.writeSnapshot(filename);
  var lastModifiedTime = null;
  var lookupCount = 0;

  scheduleCheckForFile();

  function checkForFile() {
    if(lookupCount++ > 100) {
      callback(new Error('seems like heapdump is not saved at: ', filename));
    }

    fs.stat(filename, function(err, stat) {
      if(err) {
        scheduleCheckForFile();
      } else if(stat) {
        if(lastModifiedTime && lastModifiedTime == stat.mtime.getTime()) {
          callback(null, filename);
        } else {
          lastModifiedTime = stat.mtime.getTime();
          scheduleCheckForFile();
        }
      } else {
        scheduleCheckForFile();
      }
    })
  }

  function scheduleCheckForFile() {
    setTimeout(checkForFile, 3000);
  }
});

compressIt = Meteor._wrapAsync(function(filename, callback) {
  var tarName = filename + ".tar.gz";
  var command = format("tar cvzf %s %s", path.basename(tarName), path.basename(filename));

  exec(command, {cwd: path.dirname(tarName)}, function(err, stderr, stdout) {
    if(err) {
      callback(err);
    } else {
      callback(null, tarName);
    }
  });
});

deleteFile = Meteor._wrapAsync(fs.unlink);
