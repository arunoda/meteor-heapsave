Package.describe({
  summary: 'Take heapdumps and save them into S3',
  name: 'arunoda:heapsave',
  summary: 'Wrapper around googleapis.drive',
  version: '0.1.4',
  git: 'https://github.com/arunoda/meteor-heapsave'
});

Npm.depends({
  "knox": "0.9.2",
  "heapdump": "0.3.7"
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.addFiles("lib/heapsave.js", "server");
  api.export("HeapSave", "server");
});
