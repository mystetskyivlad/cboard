var fs = require('fs');
var path = require('path');

function dirTree(filename) {
  terms = fs.readdirSync(filename).map(function (child) {
    const term = path.basename(filename + '/' + child, '.svg').replace(/_|,_to|\d\w?/g, ' ').trim().toLowerCase();
    const info = { term };
    return info;
  });

  return terms;
}

if (module.parent == undefined) {
  // node dirTree.js ~/foo/bar
  const util = require('util');
  const tree = dirTree('./public/images/mulberry-symbols/');
  const flags = {};
  const filtered = tree.filter((image) => {
    if (flags[image.term]) {
      return false;
    }
    flags[image.term] = true;
    return true;
  });
  console.log(util.inspect(filtered.length, false, null));
  var json = JSON.stringify(tree);
  fs.writeFile('myjsonfile.json', json);
}