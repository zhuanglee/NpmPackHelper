const camelCase = require('camelcase');
const path = require('path');

module.exports = (folderPath) => {
  let mods = {};
  require('fs')
    .readdirSync(folderPath)
    .forEach(file => {
      if (file[0] !== '_') { 
        let name = camelCase(file.match(/(.*?)\..*/)[1]);
        mods[camelCase(name)] = require(path.join(folderPath, file));
      }
    });
  return mods;
};

/*

function isConstructor(f) {
  try {
    return Object.keys(new f()).length !== 0;
  } catch (err) {
    if (err.message.indexOf('is not a constructor')) {
      return false;
    }
  }
  return true;
}

*/