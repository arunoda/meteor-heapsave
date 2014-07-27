Package.describe({
  "summary": "Take heapdumps and save them into S3"
});

Npm.depends({
  "knox": "0.9.0"
});

Package.on_use(function(api) {
  api.add_files("lib/heapsave.js", "server");
  api.export("HeapSave", "server");
});
